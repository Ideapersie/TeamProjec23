import {GetServerSidePropsContext} from "next";
import {MenuItem} from "@/types";
import PageTitle from "@/components/common/text/PageTitle";
import PageSubtitle from "@/components/common/text/PageSubtitle";
import {useState} from "react";

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

    const [itemName, setItemName] = useState(props.data?.name);
    const [itemDescription, setItemDescription] = useState(props.data?.description);
    const [itemType, setItemType] = useState(props.data?.type);
    const [itemPrice, setItemPrice] = useState(parseFloat(props.data?.price || "0"));
    const [itemCalories, setItemCalories] = useState(props.data?.calories);
    const [itemImage, setItemImage] = useState(props.data?.image);

    // If no item found for given id, display error message
    if (props.data === null) return <>Item not found</>;

    return (
        <>
            <PageTitle>Edit item {"->"} <span className={"text-sky-700"}>{props.data.name}</span></PageTitle>
            <PageSubtitle>Use this page to make any changes you wish to item {props.data.menuitem_id} ({props.data.name}).</PageSubtitle>

            <hr/>

            <form className={"bg-white shadow p-10 rounded-xl mt-5 flex flex-col gap-5"}>
                <label>
                    Item name
                    <input
                        type="text"
                        value={itemName}
                        onInput={e => setItemName(e.currentTarget.value)}
                    />
                </label>

                <label>
                    Item description
                    <input
                        type="text"
                        value={itemDescription}
                        onInput={e => setItemDescription(e.currentTarget.value)}
                    />
                </label>

                <label>
                    Item type
                    <select
                        value={itemType}
                        onChange={e => setItemType(e.currentTarget.value)}
                    >
                        <option value="type1">Type 1</option>
                        <option value="type2">Type 2</option>
                        <option value="type3">Type 3</option>
                    </select>
                </label>

                <label>
                    Item price
                    <input
                        type="number"
                        min={0}
                        step={0.01}
                        value={itemPrice}
                        onInput={e => e.currentTarget.value ? setItemPrice(parseFloat(e.currentTarget.value)) : undefined}
                    />
                </label>

                <label>
                    Item calories
                    <input
                        type="number"
                        value={itemCalories}
                        min={0}
                        step={1}
                        onInput={e => setItemCalories(parseInt(e.currentTarget.value))}
                    />
                </label>
            </form>
        </>
    )
}

/**
 * Fetches MenuItem data on server-side
 */
export async function getServerSideProps(ctx: GetServerSidePropsContext): Promise<{ props: Props }> {

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