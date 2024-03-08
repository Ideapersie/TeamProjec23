import Link from "next/link";
import {useRouter} from "next/router";
import {JSX, useEffect, useState} from "react";
import BurgerIcon from "@/components/common/icons/Burger";
import ReceiptIcon from "@/components/common/icons/Receipt";
import {MenuItem} from "@/types";

interface NavLink {
    display: string;
    path: string;
    children?: NavLink[];
}

interface NavGroup {
    icon?: JSX.Element;
    links: NavLink[]
}

/**
 * A component containing all the links we want to display in our navigation bar.
 *
 * @returns {JSX.Element} - The navigation links component.
 * @author Vince Chapman (zlac465@live.rhul.ac.uk)
 */
export default function NavLinks(): JSX.Element {

    const router = useRouter(); // Allows us to access the current path/url
    const [categories, setCategories] = useState<string[]>([]);

    // Gets menu items when NavLinks is first mounted
    useEffect(() => {
        fetch("/api/menu/types")
            .then(res => res.json())
            .then(data => {
                setCategories(data.types)
            })
            .catch(e => console.error(e));
    }, []);

    // An object mapping out the structure of our side menu links
    const LINKS: { [group: string]: NavGroup } = {
        "Menu Items": {
            icon: <BurgerIcon/>,
            links: [
                {
                    display: "View menu",
                    path: "/menu",
                },
                ...categories.map(category => (
                    {
                        display: category,
                        path: `/menu/${category}`
                    }
                ))
            ]
        },
        "Menu Admin": {
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
                    path: "/admin/waiter/tables"
                },
            ]
        },
        "Orders": {
            icon: <ReceiptIcon/>,
            links: [
                {
                    display: "Add links here",
                    path: "/order/addlinkshere"
                },
            ]
        }
    };

    return (
        <>
            {Object.entries(LINKS).map(([groupName, navGroup], index, array) => (
                <div className={"nav-link-group rounded"} key={groupName}>
                    <h4 className={"nav-link-group-heading flex items-center gap-1 fill-blue-500"}>
                        {navGroup.icon}
                        {groupName}
                    </h4>
                    <ul className={"nav-link-list"}>
                        {navGroup.links.map(link => (
                            <li key={link.path} className={`nav-link ${router.asPath === link.path ? "active" : ""}`}>
                                <Link href={link.path}>{link.display}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}

            <style jsx>{`
                .nav-link {
                    color: #91b4ef;
                    font-weight: 500;
                    font-size: 0.8rem;
                    margin-left: 5px;
                    transition: color 50ms ease, margin-left 50ms ease;

                    // Hover
                    &:not(.active):hover {
                        margin-left: 6px;
                        color: #5890ee;
                    }

                    // Active
                    &.active {
                        color: #001f9a;
                        //margin-left: 7px;
                    }
                }

                .nav-link-group {
                    margin-bottom: 10px;
                    background: var(--grey-1);
                    padding: 10px;
                    border: 1px outset rgba(219, 213, 245, 0.16);
                }

                .nav-link-group-heading {
                    font-weight: 500;
                    font-size: 0.9rem;
                    color: #004383;
                    padding-bottom: 5px;
                    margin-bottom: 10px;
                    margin-left: 5px;
                    border-bottom: solid #dfdcff 1px;
                }
            `}</style>
        </>
    );
}