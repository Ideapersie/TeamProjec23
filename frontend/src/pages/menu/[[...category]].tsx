import {MenuItem} from "@/types";
import {GetServerSidePropsContext} from "next";
import {CustomerMenuItem} from "@/components/menu/customer/CustomerMenuItem";
import Link from "next/link";
import {CustomerMenuFilters} from "@/components/menu/customer/CustomerMenuFilters";
import {useState} from "react";

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
                <div className ={"flex justify-end"}> 
                    <Link href={"/menu/view/cart"}>
                        <img className = "hover:rounded-lg hover:border-2 border-slate-200" alt="cart" src="https://i.postimg.cc/kgQHTvcK/istockphoto-1204513100-612x612.jpg" width="100" height="100"></img> 
                    </Link>
                </div>
                {props.category &&
                    <Link href={"/menu"} className={"text-base text-sky-500 hover:text-sky-600  hover:translate-x-1 hover:ease-in"}>
                        Go back to all items
                    </Link>
                }
                <h1 className={"mb-0 font-semibold"}>{props.category || "All items"}</h1>
                <p className={"text-stone-400"}>All our food is prepared with only the highest-quality ingredients,
                    provided by local independent farms.</p>
            </div>

            {/*Filters*/}
            <CustomerMenuFilters />

            {/*Displaying menu items*/}
            <div className={"grid grid-cols-3 gap-5"}>
                {props?.data?.length ?
                    props.data.map(item => (
                        <CustomerMenuItem
                            key={item.menuitem_id}
                            link={item.link}
                            name={item.name}
                            description={item.description}
                            price={item.price}
                            calories={item.calories}
                            image={item.image}
                            menuitem_id={item.menuitem_id}
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

    const response = await fetch("http://127.0.0.1:5000/api/menuitems/${menuitem_id}");
    let menuItems = (await response.json()) as MenuItem[];

    if (category) {
        menuItems = menuItems.filter(item => item.type === category);
    }

    return {
        props: {
            data: menuItems,
            category: category || null
        }
    }
}