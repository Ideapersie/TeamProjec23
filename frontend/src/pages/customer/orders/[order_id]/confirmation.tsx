import PageHeader from "@/components/common/text/PageHeader";
import PageTitle from "@/components/common/text/PageTitle";
import PageSubtitle from "@/components/common/text/PageSubtitle";
import type {GetServerSideProps, InferGetServerSidePropsType} from "next";
import {env} from "../../../../../env.config";
import {ApiGetOrderByIdResponse, ApiGetOrderStatusResponse} from "@/api.types";
import {useEffect, useState} from "react";
import PaymentPopup from "@/components/payment/PaymentPopup";
import LoaderWheel from "@/components/Loader";

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
 * @author Vincent Chapman-Andrews (zlac465@live.rhul.ac.uk), Idea Khan (zlac177@live.rhul.ac.uk)
 */
export default function OrderConfirmationPage(props: InferGetServerSidePropsType<typeof getServerSideProps>) {

    const [isPaid, setIsPaid] = useState(props.data.order.is_paid);
    const [status, setStatus] = useState(props.data.order.status);
    const [estimatedWait, setEstimatedWait] = useState<ApiGetOrderStatusResponse['data']['order']['estimated_wait']>(null);
    const [showPaymentWindow, setShowPaymentWindow] = useState<boolean>(false);

    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;
        fetchUpdates()
            .then(loop => {
                if (loop) {
                    interval = setInterval(fetchUpdates, 10 * 1000);  // Fetches updates every 10 seconds
                }
            })
        return () => clearInterval(interval);
    }, []);

    async function fetchUpdates(): Promise<boolean> {
        try {
            const response = await fetch(`/api/orders/${props.data.order.id}/status`);

            if (response.status != 200) {
                console.log("Something went wrong");
                return false;
            }

            const data = await response.json() as ApiGetOrderStatusResponse;

            setEstimatedWait(data.data.order.estimated_wait);
            setStatus(data.data.order.status);
            setIsPaid(data.data.order.is_paid);

            return true;

        } catch (e: any) {
            console.error(e.message);
            return false;
        }
    }

    return (
        <>
            <div className={"flex-grow flex flex-col"}>
                <PageHeader>
                    <PageTitle>Your order has been received!</PageTitle>
                    <PageSubtitle>Order ID: <span className="text-xl">{props.data.order.id}</span></PageSubtitle>
                </PageHeader>

                <div className={"bg-white shadow-lg rounded-xl flex flex-grow overflow-hidden "}>

                    {/*Left column - basket*/}
                    <div className={"flex-grow p-5"}>
                        <table className="border-collapse w-full m-2">
                            <thead>
                            <tr className="border-b text-lg text-wahaca-navy">
                                <th className="text-left">Product</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Total</th>
                            </tr>
                            </thead>
                            <tbody>
                            {props.data.order.ordered_items.map((item, index) => (
                                <tr key={index} className="border-b ">
                                    <td className="text-left">
                                        <div className="flex flex-col items-left">
                                            <div className="w-60 overflow-hidden">
                                                <h3 className="text-base font-semibold mb-0 mt-2 break-words">{item.name}</h3>
                                            </div>
                                            <img src={item.image} alt={item.name} height={50} width={160}
                                                 className="mr-5 p-2 rounded-2xl"/>
                                        </div>
                                    </td>
                                    <td className="p-5 italic text-center font-semibold">{item.quantity}</td>
                                    <td className="p-8 italic text-center">£{item.price}</td>
                                    <td className="italic text-center font-semibold">£{item.subtotal}</td>
                                    <td className="p-10"></td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        <h3>Total: £{parseFloat(props.data.order.total).toFixed(2)}</h3>
                    </div>


                    {/*Right column - Order status*/}
                    <div className={"p-10 bg-wahaca-navy flex-grow max-w-md rounded-r-2xl text-wahaca-white"}>
                        <h4 className={"text-wahaca-white text-lg font-bold"}>Track your order</h4>
                        <br></br>
                        <p>Time Ordered: {new Date(props.data.order.time_ordered).toLocaleTimeString('en-US', {
                            hour12: true,
                            hour: 'numeric',
                            minute: 'numeric'
                        })}</p>

                        <div className={"mt-5"}>
                            <p>Status: </p>
                            <strong className={status === "Unconfirmed" ? "text-wahaca-pink" : "text-wahaca-teal"}>
                                {status}
                            </strong>

                            {status != "Delivered" &&
                                <div className={"mt-5 opacity-20 !fill-wahaca-teal"}>
                                    <LoaderWheel/>
                                </div>
                            }
                        </div>

                        <div className="mt-7">
                            <ul className="font-sans font-semibold text-lg">
                                <li>
                                    <span className="font-bold italic">Table Number: </span> 
                                    {props.data.order.customer.table_number}
                                </li>
                                <li>
                                    <span className="font-bold italic">Name : </span>
                                    {props.data.order.customer.first_name} {props.data.order.customer.last_name}
                                </li>
                                <li>
                                    <span className="font-bold italic">Email : </span>
                                    {props.data.order.customer.email}
                                </li>
                                
                            </ul>
                        </div>

                        <div className={"my-10"}>
                            <h3 className={"mb-5"}>Estimated time remaining:</h3>
                            {estimatedWait === null ?
                                <p>Order not confirmed yet</p>
                                : status === "Delivered" ?
                                    <div className={"text-4xl text-emerald-500"}>
                                        <strong>Delivered!</strong>
                                    </div>
                                    : estimatedWait === 0 ?
                                        <div className={"text-4xl text-wahaca-teal"}>
                                            <strong>Your food is on its way!</strong>
                                        </div>
                                        :
                                        <div className={"text-4xl text-wahaca-yellow"}>
                                            <strong>{estimatedWait}</strong> minutes
                                        </div>
                            }
                        </div>
                    </div>
                </div>

                <hr className={"mt-5"}/>

                <div className={"flex justify-end gap-5 items-stretch text-right mt-5"}>
                    <div>
                        <h3 className={"text-3xl m-0 text-wahaca-navy"}>
                            <span>Your bill is </span>
                            {isPaid ?
                                <strong className={"text-emerald-600"}>PAID</strong>
                                :
                                <strong className={"text-wahaca-pink"}>UNPAID</strong>
                            }
                        </h3>
                        {!isPaid &&
                            <p className={"text-wahaca-light-navy text-sm"}>You can pay now, or after you have finished
                                eating</p>
                        }
                    </div>
                    {!isPaid &&
                        <button className={"m-0 font-bold text-xl bg-wahaca-blue h-full"}
                                style={{fontFamily: "verdana, sans-serif"}}
                                onClick={() => setShowPaymentWindow(true)}
                        >
                            Pay £{parseFloat(props.data.order.total).toFixed(2)}
                        </button>
                    }
                </div>
            </div>
            {showPaymentWindow &&
                <PaymentPopup
                    order_id={props.data.order.id}
                    setShowPaymentWindow={setShowPaymentWindow}
                />
            }
        </>
    )
}