import PageHeader from "@/components/common/text/PageHeader";
import PageTitle from "@/components/common/text/PageTitle";
import PageSubtitle from "@/components/common/text/PageSubtitle";
import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import {ApiFetchOrdersResponse} from "@/api.types";
import {KitchenOrderItem} from "@/components/kitchen/kitchen-order-item";
import {env} from "../../../../../env.config";

/**
 * The props required by the page component.
 */
interface Props {
    data: ApiFetchOrdersResponse
}

/**
 * Fetching data during server-side page loading.
 */
export const getServerSideProps = (async (context) => {
    const order_id = context.params?.order_id as string | undefined;

    const response = await fetch(env.apiHost + "/api/fetchorders?confirmed=true");

    if (response.status !== 200) {
        throw Error("Failed to get orders");
    }

    const data = await response.json() as ApiFetchOrdersResponse;


    return {props: {data: data}}
}) satisfies GetServerSideProps<Props>

export default function KitchenOrdersPage(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <>
            <PageHeader>
                <PageTitle>Kitchen Orders</PageTitle>
                <PageSubtitle>Here are all the confirmed orders</PageSubtitle>
            </PageHeader>


            {
                props.data.length ?
                    <div className={"grid grid-cols-3 gap-5"}>
                        {
                            props.data.map((order) => (
                                <KitchenOrderItem
                                    key={order.order_id}
                                    data={order}
                                />
                            ))
                        }
                    </div>
                    :
                    <div className={"bg-white shadow p-5 rounded-xl font-medium text-wahaca-light-blue"}>No orders</div>
            }
        </>
    )
}