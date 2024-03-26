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
        <div className={"bg-white p-5 rounded-xl flex justify-between items-center"}>
            <pre>{JSON.stringify(props.data, undefined, 2)}</pre>

            <button className={"m-0"}
                    onClick={handleTakeOrder}>
                Start order
            </button>
        </div>
    )
}