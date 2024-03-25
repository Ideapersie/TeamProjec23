import {GetServerSidePropsContext} from "next";
import {MenuItemRelatedIngredients} from "@/types";
import PageTitle from "@/components/common/text/PageTitle";
import PageSubtitle from "@/components/common/text/PageSubtitle";
import {FormEvent, useState} from "react";
import {useRouter} from "next/router";
import {env} from "../../../../../../env.config";
import SectionHeading from "@/components/common/text/SectionHeading";
import SectionSubheading from "@/components/common/text/SectionSubheading";
import PageHeader from "@/components/common/text/PageHeader";
import IngredientList, {IngredientState} from "@/components/menu/ingredients/IngredientList";
import AllergenSummary from "@/components/allergens/AllergenSummary";

/**
 * Defining component props
 */
interface Props {
    data: MenuItemRelatedIngredients | null,
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
    const [itemSpice, setItemSpice] = useState(props.data?.spice);
    const [itemImage, setItemImage] = useState(props.data?.image);
    const [itemIngredients, setItemIngredients] = useState<IngredientState>(Object.assign({}, props.data?.ingredients));

    // If no item found for given id, display error message
    if (props.data === null) {
        return <>Item not found</>;
    }

    // Saves changes for the current item
    async function handleSaveChanges(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const payload = {
            name: itemName,
            description: itemDescription,
            price: itemPrice,
            type: itemType,
            calories: itemCalories,
            image: itemImage,
            ingredients: Object.values(itemIngredients),
            spice: itemSpice
        };

        if (process.env.NODE_ENV === "development") {
            console.log(payload);
        }

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
            <PageTitle>Edit item {"—"} <span className={"text-wahaca-blue"}>{props.data.name}</span></PageTitle>
            <PageSubtitle>Use this page to make any changes you wish to item {props.data.menuitem_id} ({props.data.name}).</PageSubtitle>

            <hr/>

            <form onSubmit={handleSaveChanges} className={"bg-white shadow p-10 rounded-xl mt-5"}>

                {/*Menu item details*/}
                <div>
                    <PageHeader>
                        <SectionHeading>Item details</SectionHeading>
                        <SectionSubheading>
                            Provide basic details about the item to be displayed in the menu.
                        </SectionSubheading>
                    </PageHeader>

                    <hr className={"mb-5"}/>

                    <div className={"flex gap-10"}>
                        {/*Left column*/}
                        <div className={"flex flex-col gap-3 flex-grow"}>
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
                                    rows={5}
                                />
                            </label>

                            <label>
                                Item type
                                <input
                                    type="text"
                                    value={itemType}
                                    onChange={e => setItemType(e.currentTarget.value)}
                                    list={"datalist-types"}
                                />

                                <datalist id={"datalist-types"}>
                                    {props.types.map(type => <option key={type}>
                                        {type}
                                    </option>)
                                    }
                                </datalist>
                            </label>

                            <label>
                                Item price (£)
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

                            <label>
                                Item spice level
                                <select
                                    value={itemSpice}
                                    onChange={e => setItemSpice(parseInt(e.currentTarget.value))}
                                >
                                    <option value={0}>None</option>
                                    <option value={1}>Mild</option>
                                    <option value={2}>Medium</option>
                                    <option value={3}>Hot</option>
                                </select>
                            </label>
                        </div>

                        {/*Right column*/}
                        <div className={"flex flex-col gap-3 flex-grow max-w-xl"}>
                            <label className={"flex-grow"}>
                                Image preview
                                <div className={"bg-white shadow min-h-48 flex-grow rounded-xl overflow-hidden"}>
                                    <div
                                        className={"h-full w-full bg-red-200 !bg-center !bg-cover !bg-no-repeat"}
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
                    </div>
                </div>

                {/*Ingredient editor*/}
                <div>
                    <PageHeader className={"mt-10"}>
                        <SectionHeading>Ingredients</SectionHeading>
                        <SectionSubheading>Manage ingredients and allergens for this item below</SectionSubheading>
                    </PageHeader>

                    <hr className={"mb-5"}/>

                    <div className={"flex gap-7"}>
                        <div className={"flex-grow"} style={{maxWidth: 800}}>
                            <IngredientList
                                ingredients={itemIngredients}
                                setIngredients={setItemIngredients}
                            />
                        </div>

                        <div className={"border-l pl-7"}>
                            <h4 className={"mb-3 text-sm"}>Allergen summary</h4>
                            <AllergenSummary
                                ingredients={Object.values(itemIngredients)}
                            />
                        </div>
                    </div>
                </div>

                <hr className={"mt-10 mb-5"}/>
                <div className={"flex gap-2 justify-start"}>
                    <button
                        className={"bg-wahaca-pink m-0 text-sm"}
                        type={"button"}
                        onClick={async () => await router.push("/admin/waiter/menu/view")}
                    >
                        Cancel
                    </button>

                    <button className={"text-wahaca-white bg-wahaca-teal m-0 text-sm"}>
                        Save changes
                    </button>
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

    // Fetching item data
    if (id !== 'undefined') {
        const res = await fetch(env.apiHost + `/api/menu/item/${id}`);

        // If item fetched successfully...
        if (res.status === 200) {
            data = (await res.json())["item"] as MenuItemRelatedIngredients;
            console.log(data);
        }
    }

    // Fetching a list of all item types currently in database
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