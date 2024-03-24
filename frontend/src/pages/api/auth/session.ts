import type {NextApiRequest, NextApiResponse} from 'next'
import {sessionCookieName} from "@/components/auth/helpers";
import jwt from 'jsonwebtoken';
import {env} from "../../../../env.config";

/**
 * A type for the data stored in the decoded jwt session cookie.
 */
export interface SessionJWT {
    last_login: number,
    session_type: "customer" | "staff",
    user: {
        id: number,
        role?: "Waiter" | "Kitchen";
        is_admin?: boolean,
        first_name: string,
        last_name: string,
        email: string
    }
}

/**
 * A type representing the data returned in the response.
 */
export interface AuthSessionResponse {
    message: string
    session: SessionJWT | null
}

/**
 * An api route that returns the decoded session jwt stored in browser cookies.
 *
 * @param req
 * @param res
 * @author Vincent Chapman-Andrews (zlac465@live.rhul.ac.uk)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<AuthSessionResponse>) {

    // If wrong method type...
    if (req.method !== 'GET') {
        res.status(500).json({
            message: "Please send a GET request.",
            session: null
        });

        return;
    }

    // Get session jwt cookie
    const cookieString = req.cookies[sessionCookieName];

    // If cookie not found...
    if (!cookieString) {
        return res.status(401).json({
            message: "Not logged in",
            session: null
        });
    }

    // Decode jwt into original session data
    try {
        const decoded = jwt.verify(cookieString, env.jwtSecret) as SessionJWT;

        res.status(200).json({
            message: 'Successfully fetched session!',
            session: decoded
        });

    // If error, such as invalid signature due to tampering...
    } catch (e: any) {
        console.error(e);

        res.status(401).json({
            message: e.message,
            session: null
        })
    }
}