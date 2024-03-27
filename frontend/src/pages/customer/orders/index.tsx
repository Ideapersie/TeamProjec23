import PageHeader from "@/components/common/text/PageHeader";
import PageTitle from "@/components/common/text/PageTitle";
import PageSubtitle from "@/components/common/text/PageSubtitle";
import {ApiGetCustomerOrders} from "@/api.types";
import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import {env} from "../../../../env.config";
import {CustomerOrderItem} from "@/components/orders/customer-order-item";

/**
 * The props required by the page component.
 */
type PageProps = {
    data: ApiGetCustomerOrders['data']['orders']
}

/**
 * Fetching data during server-side page loading.
 */
export const getServerSideProps = (async (context) => {

    const response = await fetch(env.apiHost + "/api/orders/customer", {
        headers: {
            "cookie": context.req.headers.cookie || ""
        }
    });

    if (response.status !== 200) {
        throw("Failed to get order data");
    }

    const data = await response.json() as ApiGetCustomerOrders;

    return {
        props: {
            data: data.data.orders
        }
    }
    
}) satisfies GetServerSideProps<PageProps>

/**
 * Renders a page for customers to view their orders.
 *
 * @constructor
 * @author Vince Chapman-Andrews (zlac465@live.rhul.ac.uk)
 */
export default function CustomerOrdersPage(props: InferGetServerSidePropsType<typeof getServerSideProps>) {

    const unpaid = props.data.filter(i => !i.is_paid);
    const paid = props.data.filter(i => i.is_paid);

    return (
        <>
            <PageHeader>
                <PageTitle>Your orders</PageTitle>
                <PageSubtitle>View all your current and past orders on this page</PageSubtitle>
            </PageHeader>

            <div className={"p-7 bg-white rounded-xl shadow"}>
                {!(paid.length || unpaid.length) ?
                    <div className={"font-medium text-wahaca-light-blue"}>No orders</div>
                    :
                    <div className={"flex flex-col gap-8"}>
                        {unpaid.length > 0 &&
                            <div>
                                <h4 className={"text-xl mb-3 text-wahaca-pink"}>Unpaid</h4>
                                <div className={"flex flex-col gap-3"}>
                                    {unpaid.map(order => (
                                        <CustomerOrderItem
                                            key={order.id}
                                            data={order}
                                        />
                                    ))}
                                </div>
                            </div>
                        }

                        {paid.length > 0 &&
                            <div>
                                <h4 className={"text-xl mb-3 text-wahaca-teal"}>Paid</h4>
                                <div className={"flex flex-col gap-3"}>
                                    {paid.map(order => (
                                        <CustomerOrderItem
                                            key={order.id}
                                            data={order}
                                        />
                                    ))}
                                </div>
                            </div>
                        }
                    </div>
                }
            </div>
        </>
    )
}