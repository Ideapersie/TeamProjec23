import type {NextApiRequest, NextApiResponse} from 'next'
import {env} from "../../../../env.config";
import {sessionCookieName} from "@/components/auth/helpers";
import jwt from "jsonwebtoken";
import {SessionJWT} from "@/pages/api/auth/session";

export interface NavLink {
    display: string;
    path: string;
    children?: NavLink[];
}

export interface NavGroup {
    links: NavLink[]
}

export interface ApiSideMenuLinksResponse {
    message: string,
    links: {[group: string]: NavGroup} | null
}

/**
 * An api route that returns the appropriate sidemenu links, depending on user permissions
 *
 * @param req
 * @param res
 * @author Vincent Chapman-Andrews (zlac465@live.rhul.ac.uk)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiSideMenuLinksResponse>) {
    try {
        // If wrong method type...
        if (req.method !== 'GET') {
            res.status(500).json({
                message: "Please send a GET request.",
                links: null
            });
            return;
        }

        const response = await fetch(env.apiHost + "/api/menu/types");
        const data = await response.json();
        const types: string[] = data.types;

        // Get session from cookie
        const cookieString = req.cookies?.[sessionCookieName];
        if (!cookieString) {
            res.status(401).json({
                message: "Not logged in",
                links: null
            });
            return;
        }
        const session = jwt.verify(cookieString, env.jwtSecret) as SessionJWT;

        let links: {[key: string]: any} = {};

        if (session.session_type === "customer") {
            links["Menu"] = {
                links: [
                    {
                        display: "View menu",
                        path: "/menu",
                    },
                    ...types.map(category => (
                        {
                            display: category,
                            path: `/menu/${category}`
                        }
                    ))
                ]
            }

            links["Orders"] = {
                links: [
                    {
                        display: "Pay bill",
                        path: "/customer/orders",
                    },
                    {
                        display: "Order history",
                        path: "/menu"
                    }
                ]
            }
        } else if (session.user.role === "Waiter") {
            links["Menu"] = {
                links: [
                    {
                        display: "View menu items",
                        path: "/admin/waiter/menu/view"
                    },
                    {
                        display: "Add new item",
                        path: "/admin/waiter/menu/add"
                    },
                    {
                        display: "Tables",
                        path: "/admin/waiter/menu/tables"
                    },
                ]
            }
        }
        else if (session.user.role === "Kitchen") {
            links["Orders"] = {
                links: [
                    {
                        display: "Kitchen Orders",
                        path: "/staff/kitchen/orders"
                    },
                    {
                        display: "Kitchen Orders",
                        path:"/staff/kitchen/orders"
                    },
                ]
            }
        }

        if (session.user.is_admin) {
            links["Admin controls"] = {
                links: [
                    {
                        display: "View staff",
                        path: "/admin/staff"
                    }
                ]
            }
        }

        res.status(200).json({
            message: 'Successfully fetched links!',
            links
        });

    // If error, such as invalid signature due to tampering...
    } catch (e: any) {
        console.error(e);

        res.status(401).json({
            message: e.message,
            links: null
        })
    }
}