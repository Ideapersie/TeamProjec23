import PageHeader from "@/components/common/text/PageHeader";
import PageTitle from "@/components/common/text/PageTitle";
import PageSubtitle from "@/components/common/text/PageSubtitle";
import {useRouter} from "next/router";
import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import {env} from "../../../../../env.config";
import {ApiGetOrderByIdResponse} from "@/api.types";
import KitchenOrderMenuItem from "@/components/kitchen/kitchen-order-menu-item";
import {useState} from "react";
import KitchenOrderMenuItemSummary from "@/components/kitchen/kitchen-order-menu-item-summary";
import Link from "next/link";


/**
 * The props required by the page component.
 */
interface Props {
    data: ApiGetOrderByIdResponse
}


/**
 * Fetching data during server-side page loading.
 */
export const getServerSideProps = (async (context) => {
    const order_id = context.params?.order_id as string | undefined;

    // Add route that returns all order information required by this page
    const response = await fetch(env.apiHost + "/api/orders/" + order_id);

    if (response.status !== 200) {
        throw Error("Failed to get orders");
    }

    const data = await response.json() as ApiGetOrderByIdResponse

    return {props: {data}}

}) satisfies GetServerSideProps<Props>


/**
 * Renders a page for kitchen staff to update the progress of an order.
 *
 * @constructor
 * @author Vincent Chapman-Andrews (zlac465@live.rhul.ac.uk)
 */
export default function KitchenSingleOrderPage(props: InferGetServerSidePropsType<typeof getServerSideProps>) {

    const router = useRouter();

    const [selectedIndex, setSelectedIndex] = useState(0);

    /**
     * Notifies the associated waiter that order is ready to be delivered
     */
    function handleMarkReadyToDeliver() {
        // TODO: api - henry's order status route
    }

    return (
        <>
            <PageHeader>
                <Link href={"/staff/kitchen/orders"}>
                    <button className={"m-0 bg-white text-wahaca-teal mb-5"}>Go back</button>
                </Link>
                <PageTitle>Order: {router.query.order_id}</PageTitle>
                <PageSubtitle>Use this page to upgrade your progress while preparing this order.</PageSubtitle>
            </PageHeader>

            <div
                className="p-2.5 bg-wahaca-light-navy bg-opacity-50 rounded-3xl shadow flex flex-grow">
                <div className={"rounded-xl shadow-md flex flex-grow overflow-hidden"}>
                    {/*Left column*/}
                    <div className={"flex-grow bg-white rounded-tl-2xl"}>
                        {/*Display a list of menu items in the order*/}
                        <div className={"flex flex-col"}>
                            {props.data.data.order.ordered_items.length ?
                                props.data.data.order.ordered_items.map((order, index) => (
                                    <div key={order.menuitem_id}>
                                        {index != 0 && <hr/>}
                                        <KitchenOrderMenuItem
                                            data={order}
                                            isSelected={selectedIndex === index}
                                        />
                                    </div>
                                ))
                                :
                                <div>No ordered items</div>
                            }
                        </div>
                    </div>

                    {/*Right column*/}
                    <div className={"flex-grow w-full max-w-md bg-wahaca-navy p-10 flex"}>
                        <KitchenOrderMenuItemSummary
                            itemId={props.data.data.order.ordered_items[selectedIndex].menuitem_id}
                            numItems={props.data.data.order.ordered_items.length}
                            selectedIndex={selectedIndex}
                            setSelectedIndex={setSelectedIndex}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}