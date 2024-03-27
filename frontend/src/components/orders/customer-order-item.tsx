import {ApiGetCustomerOrders} from "@/api.types";
import Link from "next/link";
import {useState} from "react";
import PaymentPopup from "@/components/payment/PaymentPopup";

interface Props {
    data: ApiGetCustomerOrders['data']['orders'][0]
}

/**
 * Renders a list item displaying an order with its total
 * @constructor
 * @author Vincent Chapman-Andrews (zlac465@live.rhul.ac.uk)
 */
export function CustomerOrderItem(props: Props) {

    const [showPayPopup, setShowPayPopup] = useState<boolean>(false);

    return (
        <>
            <div className={`p-1 bg-opacity-100 rounded-xl ${props.data.is_paid ? "bg-wahaca-teal" : "bg-wahaca-pink"}`}>
                <div className={"bg-white p-3 rounded-lg shadow flex gap-3 items-center"}>
                    <div>Order: {props.data.id}</div>
                    <div>{props.data.items.length} item{props.data.items.length != 1 && "s"}</div>
                    <div>{new Date(props.data.time_ordered).toLocaleString("en-GB", {
                        dateStyle: "full",
                        timeStyle: "short"
                    })}</div>

                    <div className={"ml-auto flex gap-3 items-center"}>
                        {!props.data.is_paid &&
                            <button className={"m-0"} onClick={() => setShowPayPopup(true)}>
                                Pay bill <span className={"font-mono ml-1"}>£{parseFloat(props.data.total).toFixed(2)}</span>
                            </button>
                        }

                        <Link href={`/customer/orders/${props.data.id}/confirmation`}>
                            <button className={"m-0 bg-wahaca-teal"}>
                                View order
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {showPayPopup &&
                <PaymentPopup
                    order_id={props.data.id}
                    setShowPaymentWindow={setShowPayPopup}
                />
            }
        </>
    )
}