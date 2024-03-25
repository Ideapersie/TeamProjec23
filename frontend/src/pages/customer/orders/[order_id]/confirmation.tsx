import PageHeader from "@/components/common/text/PageHeader";
import PageTitle from "@/components/common/text/PageTitle";
import PageSubtitle from "@/components/common/text/PageSubtitle";
import type {GetServerSideProps, InferGetServerSidePropsType} from "next";
import {env} from "../../../../../env.config";
import {ApiGetOrderByIdResponse} from "@/api.types";
import {useEffect, useState} from "react";

/**
 * The props required by the page component.
 */
type PageProps = {
    data: ApiGetOrderByIdResponse["data"]
}

/**
 * Fetching data during server-side page loading.
 */
export const getServerSideProps = (async (context) => {
    const order_id = context.params?.order_id as string | undefined;

    const response = await fetch(env.apiHost + "/api/orders/" + order_id);

    if (response.status !== 200) {
        throw Error("Failed to get order data");
    }

    const data = await response.json() as ApiGetOrderByIdResponse;

    console.log(data);

    return {props: {data: data.data}}
}) satisfies GetServerSideProps<PageProps>

/**
 * Renders the order confirmation page.
 *
 * @param props
 * @constructor
 */
export default function OrderConfirmationPage(props: InferGetServerSidePropsType<typeof getServerSideProps>) {

    const [status, setStatus] = useState(props.data.order.status);
    const [subtotal, setSubtotal] = useState(0)

    useEffect(() => {
        // Loops ever 10000ms (10 second)
        setInterval(() => {
            // TODO: Call api to see if updates to order status, and update order status above
        }, 10 * 1000);
    }, []);

    return (
        <div className={"flex-grow flex flex-col"}>
            <PageHeader>
                <PageTitle>Your order has been received!</PageTitle>
                <PageSubtitle>Order Id: {props.data.order.id}</PageSubtitle>
            </PageHeader>

            <div className={"bg-white shadow rounded-xl flex flex-grow overflow-hidden"}>

                {/*Left column - basket*/}
                <div className={"flex-grow p-10"}>
                    <h4>Ordered items</h4>
                    <div>
                        Loops over items
                    </div>
                    <pre>{JSON.stringify(props.data, undefined, 2)}</pre>
                    {/* TODO: Modify to loop over ordered items, with styling similar to cart */}
                </div>

                {/*Right column - Order status*/}
                <div className={"p-10 bg-wahaca-navy flex-grow max-w-lg text-wahaca-white"}>
                    <h4 className={"text-wahaca-white"}>Track your order</h4>
                    <div>Displays check list for tracking order</div>
                </div>
            </div>

            <hr className={"mt-5"}/>

            <div className={"flex justify-end gap-5 items-stretch text-right mt-5"}>
                <div>
                    <h3 className={"text-3xl m-0 text-wahaca-navy"}>
                        <span>Your bill is </span>
                        {props.data.order.is_paid ?
                            <strong className={"text-emerald-600"}>PAID</strong>
                            :
                            <strong className={"text-wahaca-pink"}>UNPAID</strong>
                        }
                    </h3>
                    {!props.data.order.is_paid &&
                        <p className={"text-wahaca-light-navy text-sm"}>You can pay now, or after you have finished eating</p>
                    }
                </div>
                {!props.data.order.is_paid &&
                    <button className={"m-0 font-bold text-xl bg-wahaca-blue"} style={{fontFamily: "verdana, sans-serif"}}>
                        Pay £{subtotal}
                    </button>
                }
            </div>
        </div>
    )
}