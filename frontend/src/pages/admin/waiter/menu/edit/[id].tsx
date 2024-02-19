import {GetServerSidePropsContext} from "next";
import {MenuItem} from "@/types";
import PageTitle from "@/components/common/text/PageTitle";
import PageSubtitle from "@/components/common/text/PageSubtitle";

/**
 * Defining component props
 */
interface Props {
    data: MenuItem | null
}

/**
 * New page for editing menu items.
 *
 * @author Vincent Chapman-Andrews (zlac465@live.rhul.ac.uk)
 */
export default function EditMenuItemPage(props: Props) {

    // If no item found for given id, display error message
    if (props.data === null) return <>Item not found</>;

    return (
        <>
            <PageTitle>Edit item {"->"} <span className={"text-sky-700"}>{props.data.name}</span></PageTitle>
            <PageSubtitle>Use this page to make any changes you wish to item {props.data.menuitem_id} ({props.data.name}).</PageSubtitle>

            <hr/>

            <form action="" className={"bg-white shadow p-10 rounded-xl mt-5"}>
                <label htmlFor="">
                    <input type="text" name="itemName" value={props.data.name} />
                </label>
            </form>
        </>
    )
}

/**
 * Fetches MenuItem data on server-side
 */
export async function getServerSideProps(ctx: GetServerSidePropsContext): Promise<{props: Props}> {

    const id = ctx.query.id as string;

    const res = await fetch(`http://127.0.0.1:5000/api/menuitems`);
    const allItems = await res.json() as MenuItem[];

    const data = allItems.find(item => item.menuitem_id === parseInt(id)) || null;

    return {
        props: {
            data
        }
    }
}