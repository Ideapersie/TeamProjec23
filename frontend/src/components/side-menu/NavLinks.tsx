import Link from "next/link";
import {useRouter} from "next/router";
import {JSX} from "react";

const LINKS: { display: string; path: string }[] = [
    {display: "Home", path: "/"},
    {display: "Vince's Page", path: "/test/vince"},
    {display: "Alvis's Page", path: "/test/alvis"},
    {display: "Madeleine's Page", path: "/test/madeleine"},
    {display: "Idea's Page", path: "/test/idea"}
    // Add more links here
];

/**
 * A component containing all the links we want to display in our navigation bar.
 *
 * @returns {JSX.Element} - The navigation links component.
 * @author Vince Chapman (zlac465@live.rhul.ac.uk)
 */
export default function NavLinks(): JSX.Element {

    const router = useRouter(); // Allows us to access the current path/url

    return (
        <>
            <ul>
                {LINKS.map(link => (
                    <li key={link.path} className={router.pathname === link.path ? "active" : ""}>
                        <Link href={link.path}>{link.display}</Link>
                    </li>
                ))}
            </ul>

            <style jsx>{`
                li {
                    color: #91b4ef;
                    font-weight: 500;

                    &.active {
                        color: #004a9f;
                    }
                }
            `}</style>
        </>
    );
}