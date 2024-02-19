import NavLinks from "@/components/side-menu/NavLinks";
import {Inter} from "next/font/google";
import Link from "next/link";
import CurrentUser from "@/components/side-menu/CurrentUser";
import React from "react";
import Image from "next/image";

const inter = Inter({ subsets: ['latin'] });

const SIDE_MENU_WIDTH = 250;

/**
 * MainLayout component which provides a side menu.
 *
 * @param {Object} props - The props object.
 * @param {React.ReactNode} props.children - The children components to render.
 *
 * @returns {React.ReactNode} The rendered MainLayout component.
 */
export default function MainLayout({ children }: any): React.ReactNode {
    return (
        <div className={`min-h-screen ${inter.className}`}>

            {/*Left panel / side menu*/}
            <nav className={"fixed bg-gray-50 border-r border-r-sky-900 border-opacity-10 h-screen left-panel flex flex-col"} style={{width: SIDE_MENU_WIDTH}}>
                <div className={"p-5"}>
                    {/*Logo*/}
                    <Link href={"/"}>
                        <div className={"relative h-16 mb-3 rounded-lg"}>
                            <Image src={"/logo.png"} alt={"Wahaha logo"} fill={true} objectFit={"contain"}/>
                        </div>
                    </Link>

                    {/*Side-menu Links*/}
                    <NavLinks/>
                </div>

                {/*Displays the user that is currently logged in*/}
                <CurrentUser/>
            </nav>

            {/*Right panel / page contents*/}
            <main className={"p-16"} style={{marginLeft: SIDE_MENU_WIDTH}}>
                {children}
            </main>

            <style jsx>{`
                .left-panel {
                    box-shadow: rgba(230, 233, 236, 0.67) 1px 0px 10px;
                }
            `}</style>
        </div>
    )
}