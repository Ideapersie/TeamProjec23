import NavLinks from "@/components/side-menu/NavLinks";

const SIDE_MENU_WIDTH = 250;

export default function MainLayout({ children }: any) {
    return (
        <div className={"min-h-screen"}>
            {/*Left panel / side menu*/}
            <nav className={"fixed bg-gradient-to-r from-sky-50 to-white h-screen"} style={{width: SIDE_MENU_WIDTH}}>
                <div className={"p-10"}>
                    <NavLinks/>
                </div>
            </nav>

            {/*Right panel / page contents*/}
            <main className={"p-10"} style={{marginLeft: SIDE_MENU_WIDTH}}>
                {children}
            </main>
        </div>
    )
}