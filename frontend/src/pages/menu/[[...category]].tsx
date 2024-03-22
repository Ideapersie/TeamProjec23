import {MenuItem} from "@/types";
import {GetServerSidePropsContext} from "next";
import {CustomerMenuItem} from "@/components/menu/customer/CustomerMenuItem";
import Link from "next/link";
import {CustomerMenuFilters} from "@/components/menu/customer/CustomerMenuFilters";
import {env} from "../../../env.config";
import PageTitle from "@/components/common/text/PageTitle";
import {CartButton} from "@/components/cart-button";


// Declaring expected prop types
interface Props {
    data: MenuItem[],
    category: string | null
}


// Page component - View Menu
export default function ViewMenu(props: Props) {

    return <>
        <section>
            <div className={"mb-4"}>
                <div className ={"flex justify-between items-center"}>                
                    {props.category &&
                        <Link href={"/menu"} className={"text-base text-wahaca-teal hover:text-wahaca-blue  hover:translate-x-1 hover:ease-in"}>
                            Go back to all items
                        </Link>
                    }
                    <div className="flex-grow flex justify-center">
                        <PageTitle>MENU</PageTitle>
                    </div>
                    <button
                        className="bg-wahaca-blue hover:bg-wahaca-teal text-white font-bold py-2 px-4 rounded-lg transition-colors ease-in-out mr-4" 
                        onClick={() => alert('The waiter has been called!')}>
                        Call Waiter
                    </button>

                    <CartButton/>
                </div>

                <p className={"text-stone-400"}>
                    All our food is prepared with only the highest-quality ingredients,
                    provided by local independent farms.
                </p>
            </div>

            {/*Filters*/}
            <CustomerMenuFilters/>

            {/*Displaying menu items*/}
            <div className={"grid grid-cols-4 gap-4"}>
                {props?.data?.length ?
                    props.data.slice().reverse().map(item => (
                        <CustomerMenuItem
                            key={item.menuitem_id}
                            data={item}
                        />
                    ))
                    :
                    <div className={"bg-white shadow rounded-lg px-3 py-2 text-xs text-sky-800"}>
                        No items for this category
                    </div>
                }
            </div>
        </section>
    </>
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<{ props: Props }> {

    const category = context.query?.category?.[0] as string | undefined;
    const allergies = context.query.allergies as string | undefined;

    let endpoint = new URL(env.apiHost + "/api/menu");

    if (category) {
        endpoint.searchParams.set('type', category);
    }

    if (allergies) {
        endpoint.searchParams.set('allergies', allergies);
    }

    const response = await fetch(endpoint);
    let menuItems = (await response.json()) as MenuItem[];

    return {
        props: {
            data: menuItems,
            category: category || null
        }
    }
}