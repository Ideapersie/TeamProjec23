import NavLinks from "@/components/side-menu/NavLinks";
import {Inter} from "next/font/google";
import Link from "next/link";
import CurrentUser from "@/components/side-menu/CurrentUser";
import React from "react";
import Image from "next/image";
import {NotiButton} from "@/components/noti-button";
import {CartButton} from "@/components/cart-button";
import {CallWaiterButton} from "@/components/call-button";

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
            <nav className={"fixed bg-white border-r border-r-sky-900 border-opacity-10 h-screen left-panel"}
                 style={{width: SIDE_MENU_WIDTH}}>
                <div className={"p-5 z-10 relative"}>
                    {/*Logo*/}
                    <Link href={"/"}>
                        <div className={"relative h-16 mb-3  bg-white"}>
                            <Image src={"/logo.png"} alt={"Wahaca logo"} fill={true} objectFit={"contain"}/>
                        </div>
                    </Link>

                    {/*Side-menu Links*/}
                    <NavLinks/>
                </div>

                <div className={"overflow-hidden absolute bottom-0 w-full"}>
                    <div className={"h-96 relative text-right -mr-10 -mb-10"}>
                        <Image src={"/wahaca-trees.svg"}
                               alt={"Wahaca trees"}
                               fill={true}
                               objectFit={"cover"}
                               objectPosition={"right"}
                        />
                    </div>

                    {/*Displays the user that is currently logged in*/}
                    <CurrentUser/>
                </div>
            </nav>

            {/*Right panel / page contents*/}
            <main className={"p-16"} style={{marginLeft: SIDE_MENU_WIDTH}}>
                <div className={"relative"}>
                    {children}

                    <div className={"absolute right-0 top-0"}>
                        <div className="flex gap-5 items-center">
                            <CallWaiterButton/>
                            <CartButton/>
                            <NotiButton/>
                        </div>
                    </div>
                </div>
            </main>

            <style jsx>{`
                .left-panel {
                    box-shadow: rgba(230, 233, 236, 0.67) 1px 0px 10px;
                }
            `}</style>
        </div>
    )
}