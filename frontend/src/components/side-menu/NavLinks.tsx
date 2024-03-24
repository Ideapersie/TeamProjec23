import Link from "next/link";
import {useRouter} from "next/router";
import {JSX, useEffect, useState} from "react";
import {ApiSideMenuLinksResponse, NavGroup} from "@/pages/api/sidemenu/links";

/**
 * A component containing all the links we want to display in our navigation bar.
 *
 * @returns {JSX.Element} - The navigation links component.
 * @author Vince Chapman (zlac465@live.rhul.ac.uk)
 */
export default function NavLinks(): JSX.Element {

    const router = useRouter(); // Allows us to access the current path/url

    const [links, setLinks] = useState<{[group: string]: NavGroup} | null | undefined>();

    // Fetches side-menu links on load
    useEffect(() => {
        fetch('/api/sidemenu/links')
            .then(res => res.json() as Promise<ApiSideMenuLinksResponse>)
            .then(data => {
                setLinks(data.links)
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <div className={`transition-opacity duration-500 ${links ? "opacity-100" : "opacity-0"}`}>
            {
                links &&
                    Object.entries(links).map(([groupName, navGroup], index, array) => (
                        <div className="bg-wahaca-light-blue p-4 mb-4" key={groupName}>
                            <div className="bg-white p-4">
                                <h4 className="text-xl text-wahaca-navy">
                                    {groupName}
                                </h4>
                                <ul className="text-sm text-wahaca-light-navy">
                                    {navGroup.links.map(link => (
                                        <li key={link.path} className={`nav-link ${router.asPath === link.path ? "active" : ""}`}>
                                            <Link href={link.path}>{link.display}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))
            }
        
            <style jsx>{`
                .nav-link {
                    transition: color 50ms ease, margin-left 50ms ease;
                    opacity: 80%;

                    // Hover
                    &:not(.active):hover {
                        color: var(--wahaca-teal);
                    }

                    // Active
                    &.active {
                        opacity: 100%
                    }
                }
            `}</style>

        </div>
    );
}