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
        <div className="">
            <div className={"bg-white shadow-md p-3 rounded-xl items-center"}>
                <div className={"p-2 pt-1"}>
                    <h4 className={"mb-0"}>New order!</h4>
                    <span className={"text-sm font-medium text-wahaca-teal"}>For {props.data.customer.first_name} on Table {props.data.customer.table_number}</span>
                </div>
                <div className="gap-5">
                    <div className="border-2 border-wahaca-pink border-opacity-20 p-5 rounded-xl bg-wahaca-white">
                        <h3 className="text-lg font-bold">Order ID: {props.data.order_id}</h3>
                        <p className="text-sm">Customer ID: {props.data.customer_id}</p>
                        <p className="text-sm">Status: {props.data.status}</p>
                        <p className="text-sm">Order
                            Time: {new Date(props.data.time_ordered).toLocaleTimeString('en-US', {
                                hour12: true,
                                hour: 'numeric',
                                minute: 'numeric'
                            })}
                        </p>
                        <button className={"mt-5 mb-0"}
                                onClick={handleTakeOrder}>
                            Start order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}