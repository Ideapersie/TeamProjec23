import PageTitle from "@/components/common/text/PageTitle";
import PageSubtitle from "@/components/common/text/PageSubtitle";
import PageHeader from "@/components/common/text/PageHeader";
import MenuList from "@/components/menu/MenuList";
import MockData from "../../../../mockdata/menu-data.json";

// The data to be passed in as props
interface Props {
    data: typeof MockData
}

export default function AddItemPage(props: Props) {
    return (
        <>
            <PageHeader>
                <PageTitle>
                    View Items
                </PageTitle>
                <PageSubtitle>
                    Use this page to view which items are being displayed on the menu. You can add new items, delete items,
                    and edit items all from this page.
                </PageSubtitle>
            </PageHeader>

            <MenuList dishes={props.data}>

            </MenuList>
        </>
    )
}

// Loads data on the server (instead of on the browser) -> more secure + data available on page load
export async function getServerSideProps(): Promise<{props: Props}> {

    // TODO: Replace mock data with a call to the backend server here
    const response = await fetch("http://127.0.0.1:5000/api/menuitems");
    const data = await response.json();

    // ...and passes it to the ViewMenuPage component via props
    return {
        props: {
            data: data
        }
    };
}