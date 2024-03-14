import {MenuItem} from "@/types";
import {GetServerSidePropsContext} from "next";
import {CustomerMenuItem} from "@/components/menu/customer/CustomerMenuItem";
import {CustomerMenuFilters} from "@/components/menu/customer/CustomerMenuFilters";
import {env} from "../../../env.config";
import PageHeader from "@/components/common/text/PageHeader";
import PageTitle from "@/components/common/text/PageTitle";

// Declaring expected prop types
interface Props {
    data: MenuItem[],
    category: string | null
}

// Page component - View Menu
export default function ViewMenu(props: Props) {
    return <>
        <PageHeader>
            <PageTitle>
                MENU
            </PageTitle>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"/>
        </PageHeader>
        
        <section>

            <button className={"bg-transparent absolute top-12 right-14"} onClick={() => window.location.href = "/menu/view/cart"}>
                <i className="fas fa-shopping-cart text-wahaca-blue fa-3x"></i>
            </button>

            {/*Filters*/}
            <div className=''>
                <CustomerMenuFilters/>
            </div>

            {/*Displaying menu items*/}
            <div className={"grid grid-cols-3 gap-5 bg-white"}>
                {props?.data?.length ?
                    props.data.map(item => (
                        <CustomerMenuItem
                            key={item.menuitem_id}
                            name={item.name}
                            description={item.description}
                            price={item.price}
                            calories={item.calories}
                            image={item.image}
                            menuitem_id={item.menuitem_id}
                            type={item.type}
                        />
                    ))
                    :
                    <div className={"bg-white shadow px-3 py-2 text-xs text-sky-800"}>
                        No items for this category
                    </div>
                }
            </div>
        </section>
    </>
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<{ props: Props }> {

    const category = context.query?.category?.[0] as string | undefined;

    let endpoint = env.apiHost + "/api/menu";

    if (category) {
        endpoint += `?type=${category}`;
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