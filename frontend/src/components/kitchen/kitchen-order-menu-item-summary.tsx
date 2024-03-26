import {useEffect, useState} from "react";
import {ApiGetMenuItemById} from "@/api.types";

interface Props {
    order_id: number
}

export default function KitchenOrderMenuItemSummary(props: Props) {

    const [data, setData] = useState<ApiGetMenuItemById['item'] | undefined | null>(undefined);

    useEffect(() => {
        setData(undefined);
        fetch(`/api/menu/item/${props.order_id}`)
            .then(res => res.json() as Promise<ApiGetMenuItemById>)
            .then(data => {
                setData(data.item);
            })
    }, [props.order_id]);

    return (
        <div className={"flex-grow"}>
            {data === undefined ?
                <div>Loading...</div>
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


                    </div>
            }
        </div>
    )
}