import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {ApiGetMenuItemById} from "@/api.types";
import LoaderWheel from "@/components/Loader";
import {useRouter} from "next/router";

interface Props {
    itemId: number
    numItems: number
    selectedIndex: number
    setSelectedIndex: Dispatch<SetStateAction<number>>
}

export default function KitchenOrderMenuItemSummary(props: Props) {

    const isLastItem = props.selectedIndex + 1 === props.numItems;

    const router = useRouter();

    const [data, setData] = useState<ApiGetMenuItemById['item'] | undefined | null>(undefined);
    const [startedItem, setStartedItem] = useState<boolean>(false);
    const [waiterNotified, setWaiterNotified] = useState(false);

    useEffect(() => {
        setData(undefined);
        fetch(`/api/menu/item/${props.itemId}`)
            .then(res => res.json() as Promise<ApiGetMenuItemById>)
            .then(data => {
                setData(data.item);
            })
    }, [props.itemId]);

    useEffect(() => {
        setStartedItem(false);
    }, [props.selectedIndex]);

    async function handleStartItem() {
        // TODO: Call api
        try {
            const res = await fetch('/api/changeorderstatus', {
                method: "POST",
                body: JSON.stringify({
                    order_id: router.query.order_id,
                    status: `Preparing ${data?.name}...`
                })
            });

            if (res.status !== 200) {
                alert("Failed to update order status");
            }
        } catch (e: any) {
            console.error(e.message);
        }
        setStartedItem(true);
    }

    function handleNextItem() {
        props.setSelectedIndex((old) => old + 1);
    }

    async function handleFinishOrder() {
        try {
            const res = await fetch("/api/orderReady/" + router.query.order_id)
        } catch (e: any) {
            console.error(e.message)
        }
        setWaiterNotified(true);
        setTimeout(async () => {
            await router.push("/staff/kitchen/orders");
        }, 1000);
    }

    return (
        <div className={"flex-grow"}>
            {data === undefined ?
                <LoaderWheel/>
                : data === null ?
                    <div>Menu item not found</div>
                    :
                    <div className={"text-wahaca-white"}>
                        <h3 className={"text-wahaca-teal mb-1 font-extrabold"}>{data.name}</h3>
                        <p className={"text-wahaca-light-blue"}>{data.description}</p>

                        <div>
                            <h4 className={"text-wahaca-yellow mt-5"}>Ingredients</h4>
                            <ol className={"list-decimal list-inside"}>
                                {data.ingredients.map((ingredient, index) => (
                                    <li key={ingredient.name + ingredient.allergen}>
                                        {ingredient.name}
                                    </li>
                                ))}
                            </ol>
                        </div>

                        <div className={"flex flex-col gap-2 mt-5"}>
                            <button className={"m-0 w-fit bg-emerald-500"}
                                    onClick={handleStartItem}
                                    disabled={startedItem}>
                                Started item
                            </button>
                            <button className={`m-0 w-fit ${!isLastItem ? "bg-wahaca-light-navy" : ""}`}
                                    onClick={isLastItem ? handleFinishOrder : handleNextItem}
                                    disabled={!startedItem || waiterNotified}>
                                {isLastItem ? "Finish order" : "Next item"}
                            </button>
                            {waiterNotified &&
                                <div className={"text-xs text-wahaca-yellow "}>Waiter notified!</div>
                            }
                        </div>
                    </div>
            }
        </div>
    )
}