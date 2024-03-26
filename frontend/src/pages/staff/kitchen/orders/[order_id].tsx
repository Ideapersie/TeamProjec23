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

    const [selectedItem, setSelectedItem] = useState<number>(props.data.data.order.ordered_items[0].menuitem_id)

    /**
     * Updates the order status, to keep the customer informed.
     */
    function handleUpdateStatus() {
        // TODO: api - update status (shannon's route)
    }

    /**
     * Notifies the associated waiter that order is ready to be delivered
     */
    function handleMarkReadyToDeliver() {
        // TODO: api - henry's order status route
    }

    return (
        <>
            <PageHeader>
                <PageTitle>Order: {router.query.order_id}</PageTitle>
                <PageSubtitle>Use this page to upgrade your progress while preparing this order.</PageSubtitle>
            </PageHeader>

            {/*TODO: Dropdown to update order status*/}

            <div className={"bg-white rounded-xl shadow flex flex-grow overflow-hidden"}>
                {/*Left column*/}
                <div className={"flex-grow"}>
                    {/*<pre>{JSON.stringify(props.data.data.order, undefined, 2)}</pre>*/}

                    {/*TODO: Display a list of menu items in the order*/}
                    <div className={"flex flex-col pt-3"}>
                        {props.data.data.order.ordered_items.length ?
                            props.data.data.order.ordered_items.map((order, index) => (
                                <div key={order.menuitem_id}>
                                    {index != 0 && <hr/>}
                                    <KitchenOrderMenuItem
                                        data={order}
                                        selectedItem={selectedItem}
                                        setSelectedItem={setSelectedItem}
                                    />
                                </div>
                            ))
                            :
                            <div>No ordered items</div>
                        }
                    </div>

                    {/*TODO: Button to mark order as done*/}
                    <button onClick={handleMarkReadyToDeliver} className={"m-0"}>
                        Ready to delivery
                    </button>
                </div>

                {/*Right column*/}
                <div className={"flex-grow w-full max-w-md bg-wahaca-navy p-10 flex"}>
                    <KitchenOrderMenuItemSummary
                        order_id={selectedItem}
                    />
                </div>
            </div>
        </>
    )
}