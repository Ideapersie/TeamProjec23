import {GetServerSidePropsContext} from "next";
import {MenuItem} from "@/types";
import PageTitle from "@/components/common/text/PageTitle";
import PageSubtitle from "@/components/common/text/PageSubtitle";
import {FormEvent, useState} from "react";
import {useRouter} from "next/router";

/**
 * Defining component props
 */
interface Props {
    data: MenuItem | null,
    types: string[]
}

/**
 * New page for editing menu items.
 *
 * @author Vincent Chapman-Andrews (zlac465@live.rhul.ac.uk)
 */
export default function EditMenuItemPage(props: Props) {

    const router = useRouter();

    const [itemName, setItemName] = useState(props.data?.name);
    const [itemDescription, setItemDescription] = useState(props.data?.description);
    const [itemType, setItemType] = useState(props.data?.type);
    const [itemPrice, setItemPrice] = useState(parseFloat(props.data?.price || "0"));
    const [itemCalories, setItemCalories] = useState(props.data?.calories);
    const [itemImage, setItemImage] = useState(props.data?.image);

    // If no item found for given id, display error message
    if (props.data === null) return <>Item not found</>;

    // Saves changes for the current item
    async function handleSaveChanges(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const payload = {
            name: itemName,
            description: itemDescription,
            price: itemPrice,
            type: itemType,
            calories: itemCalories,
            image: itemImage
        };

        console.log(payload);
        const url = `${env.apiHost}/api/updateitem/${props.data?.menuitem_id}`;

        const res = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(payload),
            mode: 'no-cors'
        });

        // TODO: Add check for success response

        await router.push('/admin/waiter/menu/view');
    }

    return (
        <>
            <PageTitle>Edit item {"->"} <span className={"text-sky-700"}>{props.data.name}</span></PageTitle>
            <PageSubtitle>Use this page to make any changes you wish to item {props.data.menuitem_id} ({props.data.name}).</PageSubtitle>

            <hr/>

            <form onSubmit={handleSaveChanges} className={"bg-white shadow p-10 rounded-xl mt-5 flex gap-7"}>
                {/*Left column*/}
                <div className={"flex flex-col gap-5 flex-grow"}>
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
                        <textarea
                            value={itemDescription}
                            onInput={e => setItemDescription(e.currentTarget.value)}
                            rows={3}
                        />
                    </label>

                    <label>
                        Item type
                        <select
                            value={itemType}
                            onChange={e => setItemType(e.currentTarget.value)}
                        >
                            {/*TODO: Come up with a better solution here*/}
                            <option value="Burgers">Burgers</option>
                            <option value="Sides">Sides</option>
                            <option value="Drinks">Drinks</option>
                            <option value="Desserts">Desserts</option>
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

                    <div>
                        <button className={"bg-emerald-500 hover:bg-emerald-700"}>Save changes</button>
                    </div>
                </div>

                {/*Right column*/}
                <div className={"flex flex-col gap-5 flex-grow max-w-80"}>
                    <label>
                        Image preview
                        <div className={"bg-white shadow h-48 rounded-xl overflow-hidden p-5"}>
                            <div
                                className={"h-full w-full bg-red-200 !bg-center !bg-contain !bg-no-repeat"}
                                style={{background: `url(${itemImage})`}}
                            />
                        </div>
                    </label>

                    <label>
                        Image URL
                        <input type="url"
                               value={itemImage}
                               onChange={e => setItemImage(e.currentTarget.value)}
                        />
                    </label>
                </div>
            </form>
        </>
    )
}

/**
 * Fetches MenuItem data on server-side
 */
export async function getServerSideProps(ctx: GetServerSidePropsContext): Promise<{ props: Props }> {

    const id = ctx.query.id as string;

    let data = null;

    if (id !== 'undefined') {
        const res = await fetch(env.apiHost + `/api/menu/item/${id}?test`);

        // If item fetched successfully...
        if (res.status === 200) {
            data = (await res.json())["item"] as MenuItem;
            console.log(data);
        }
    }

    const res = await fetch(env.apiHost + "/api/menu/types");
    const typesData = await res.json();

    let types: string[] = typesData.types || [];

    return {
        props: {
            data,
            types
        }
    }
}