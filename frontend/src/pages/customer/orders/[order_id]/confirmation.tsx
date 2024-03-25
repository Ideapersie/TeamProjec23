import PageHeader from "@/components/common/text/PageHeader";
import PageTitle from "@/components/common/text/PageTitle";
import PageSubtitle from "@/components/common/text/PageSubtitle";
import type {GetServerSideProps, InferGetServerSidePropsType} from "next";
import {env} from "../../../../../env.config";
import {ApiGetOrderByIdResponse} from "@/api.types";
import {useEffect, useState} from "react";
import Link from "next/link";

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
    const [subtotal, setSubtotal] = useState(0);

    useEffect(() => {
        // Loops ever 10000ms (10 second)
        setInterval(() => {
            // TODO: Call api to see if updates to order status, and update order status above
        }, 10 * 1000);
    }, []);


    return (
        <div className={"flex-grow flex flex-col "}>
            <PageHeader>
                <PageTitle>Your order has been received!</PageTitle>
                <PageSubtitle>Order ID: <span className = "text-xl">{props.data.order.id}</span></PageSubtitle>
            </PageHeader>

            <div className={"bg-white shadow-lg rounded-xl flex flex-grow overflow-hidden "}>
                
                {/* <div className={"flex-grow p-10"}>
                    <h4>Ordered items</h4>
                    <br></br>
                    <div>
                        <ul>
                            <li>Name: {props.data.order.customer.first_name} {props.data.order.customer.last_name}</li>
                            <li>Email: {props.data.order.customer.email}</li>
                            <li className = "font-sans font-bold">Table Number: {props.data.order.customer.table_number}</li>
                        </ul>
                    </div>
                    <div className="grid grid-cols-4 gap-4 mt-5">
                        {props.data.order.ordered_items.map((item, index) => (
                            <div key={index} className="border p-4 rounded-lg">
                                <img src={item.image} alt={item.name} className="w-full h-auto mb-2" />
                                <h3 className="text-lg font-bold">{item.name}</h3>
                                <p className="text-sm">Price: £{item.price}</p>
                                <p className="text-sm">Quantity: {item.quantity}</p>
                                <p className="text-sm">Subtotal: £{item.subtotal}</p>
                            </div>
                        ))}
                    </div> 
                </div> */}
                {/*Left column - basket*/}
                    <div className={"flex-grow p-5"}>
                        <table className="border-collapse w-full m-2">
                            <thead>
                                <tr className="border-b text-lg text-wahaca-navy">
                                    <th className="text-left">Product</th>
                                    <th >Quantity</th>
                                    <th>Price</th>
                                    <th>Subtotal</th>
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
                                                <img src={item.image} alt={item.name} height={50} width ={160} className="mr-5 p-2 rounded-2xl" />
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
                    </div>


                {/*Right column - Order status*/}
                <div className={"p-10 bg-wahaca-navy flex-grow rounded-r-2xl text-wahaca-white"}>
                    <h4 className={"text-wahaca-white"}>Track your order</h4>
                    <div>Displays check list for tracking order</div>
                    <br></br>
                        <p>Status: {props.data.order.status}</p>
                        <p>Time Ordered: {new Date(props.data.order.time_ordered).toLocaleTimeString('en-US', {hour12: true, hour: 'numeric', minute: 'numeric'})}</p>
                    <br></br>
                    <div>
                        <ul>
                            <li>Name: {props.data.order.customer.first_name} {props.data.order.customer.last_name}</li>
                            <li>Email: {props.data.order.customer.email}</li>
                            <li className = "font-sans font-bold">Table Number: {props.data.order.customer.table_number}</li>
                            
                        </ul>
                    <div className = "text-2xl font-sans font-bold absolute bottom-10 "> Total Price: <span className="italic">£{props.data.order.total}</span></div>
                    </div>
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
                    <Link href={`/customer/orders/${props.data.order.id}/pay`}>
                        <button className={"m-0 font-bold text-xl bg-wahaca-blue h-full"}
                                style={{fontFamily: "verdana, sans-serif"}}>
                            Pay £{props.data.order.total}
                        </button>
                    </Link>
                }
            </div>
        </div>
    )
}