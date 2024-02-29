import PageTitle from "@/components/common/text/PageTitle";
import PageSubtitle from "@/components/common/text/PageSubtitle";
import PageHeader from "@/components/common/text/PageHeader";
import AdminMenuList from "@/components/menu/admin/AdminMenuList";
import {MenuItem} from "@/types";
import {DeleteItemPopup} from "@/components/menu/admin/DeleteItemPopup";
import {createContext, Dispatch, JSX, SetStateAction, useState} from "react";

// The data to be passed in as props
interface Props {
    data: MenuItem[]
}

// Context object to allow itemToDelete state to be accessed by child components (without prop drilling)
export const AdminViewMenuPageContext = createContext<{
    itemToDelete: MenuItem | undefined,
    setItemToDelete: Dispatch<SetStateAction<MenuItem | undefined>>
} | undefined>(undefined);

/**
 * Renders a page for waiters to manage items in the menu.
 *
 * @param {Props} props - The props object containing the data required by the Add Item page.
 * @return {JSX.Element} - The JSX element representing the Add Item page.
 * @author Vincent Chapman-Andrews (zlac465@live.rhul.ac.uk)
 */
export default function AdminViewMenuPage(props: Props): JSX.Element {

    // The id (number) of menu item staged for deletion. If NOT undefined, displays delete confirmation popup window
    const [itemToDelete, setItemToDelete] = useState<MenuItem | undefined>();

    return (
        <AdminViewMenuPageContext.Provider value={{itemToDelete, setItemToDelete}}>
            <PageHeader>
                <PageTitle>
                    View Items
                </PageTitle>
                <PageSubtitle>
                    Use this page to view which items are being displayed on the menu. You can add new items, delete items,
                    and edit items all from this page.
                </PageSubtitle>
            </PageHeader>

            {/*Displays a list of menu items*/}
            <AdminMenuList dishes={props.data}/>

            {/*I.e. if an item is staged for deletion, then display popup*/}
            {itemToDelete !== undefined &&
                <DeleteItemPopup/>
            }
        </AdminViewMenuPageContext.Provider>
    )
}

// Loads data on the server (instead of on the browser) -> more secure + data available on page load
export async function getServerSideProps(): Promise<{props: Props}> {

    const response = await fetch("http://127.0.0.1:5000/api/menuitems/${menuitem_id}");
    const data = await response.json() as MenuItem[];

    // ...and passes it to the ViewMenuPage component via props
    return {
        props: {
            data
        }
    };
}