import {ApiFetchOrdersResponse} from "@/api.types";
import {useRouter} from "next/router";

interface Props {
    data: ApiFetchOrdersResponse[0]

}

export function KitchenOrderItem(props: Props) {

    const router = useRouter();

    // Allows a kitchen staff member to assign an order to themselves
    async function handleTakeOrder() {
        // TODO: api call

        // TODO: Success check
        if (true) {
            await router.push(`/staff/kitchen/orders/${props.data.order_id}`)
        }
    }

    return (
            // <div className="hidden">
            //         <table className="border-collapse w-full m-2">
            //             <thead>
            //                 <tr className="border-b text-lg text-wahaca-navy">
            //                     <th className="text-left">Product</th>
            //                     <th>Quantity</th>
            //                     <th>Price</th>
            //                     <th>Total</th>
            //                 </tr>
            //             </thead>
            //             <tbody>
            //                 <tr className="border-b ">
            //                     <td className="text-left"></td>
            //                     <td className="p-5 italic text-center font-semibold">{props.data.order_id}</td>
            //                     <td className="p-8 italic text-center">£{props.data.customer_id}</td>
            //                     {/* <td className="italic text-center font-semibold">£{item.subtotal}</td> */}
            //                     <td className="p-10"></td>
            //                 </tr>
            //             </tbody>
            //         </table>
            // </div>
        <div className="">
            <div className={"bg-white p-5 rounded-xl items-center grid grid-cols-4 "}>
                <div className={"p-5 bg-red-200"}>
                    <h4>Ordered items</h4>
                    <div className="gap-5 mt-5">
                        <div className="border-2 p-5 rounded-xl">
                            <h3 className="text-lg font-bold">Order ID: {props.data.order_id}</h3>
                            <p className="text-sm">Customer ID: {props.data.customer_id}</p>
                            <p className="text-sm">Status: {props.data.status}</p>
                            <p className="text-sm">Order Time: {new Date(props.data.time_ordered).toLocaleTimeString('en-US', {
                                hour12: true,
                                hour: 'numeric',
                                minute: 'numeric'
                                })}
                            </p>
                            <button className={"mt-5"}
                                onClick={handleTakeOrder}>
                                Start order
                            </button>
                        </div>  
                    </div>
                </div>
            </div>
        </div>
    )
}