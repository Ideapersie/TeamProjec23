import {ApiGetOrderByIdResponse} from "@/api.types";
import {Dispatch, SetStateAction} from "react";

interface Props {
    data: ApiGetOrderByIdResponse['data']['order']['ordered_items'][0]
    selectedItem: number
    setSelectedItem: Dispatch<SetStateAction<number>>
}

export default function KitchenOrderMenuItem(props: Props) {

    const isSelected = props.selectedItem === props.data.menuitem_id

    function handleSelectItem() {
        props.setSelectedItem(props.data.menuitem_id);
    }

    return (
        <div className={`flex gap-5 select-none items-center py-5 px-10 ${isSelected ? "bg-wahaca-navy !text-wahaca-white" : ""}`} onClick={handleSelectItem} role={"button"}>
            {/*Image*/}
            <div
                style={{backgroundImage: `url(${props.data.image})`}}
                className={"min-w-32 min-h-20 rounded-xl shadow self-stretch bg-center bg-cover"}
            />

            <div className={"text-sm"}>
                <h4 className={isSelected ? "text-wahaca-white" : ""}>{props.data.name}</h4>
                <p className={"text-wahaca-teal"}>{props.data.type}</p>
            </div>

            <div className={"ml-auto"}>
                <span className={"text-3xl font-extrabold"}>x {props.data.quantity}</span>
            </div>
        </div>
    )
}