import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {BrowserCartObject, MenuItem} from "@/types";
import Link from "next/link";

interface Props {
    id: number
    quantity: number
    setOrderedItems: Dispatch<SetStateAction<BrowserCartObject | null | undefined>>
    subtotal: {[id: number]: number}
    setSubtotal: Dispatch<SetStateAction<{[id: number]: number}>>
}

export default function CartItem(props: Props) {

    const [data, setData] = useState<MenuItem | undefined>();
    const [quantity, setQuantity] = useState(props.quantity);
    const [itemSubtotal, setItemSubtotal] = useState<number>(0);

    useEffect(() => {
        fetch(`/api/menu/item/${props.id}`)
            .then(r => r.json())
            .then(data => {
                setData(data.item);
            })
            .catch(err => console.error(err));
    }, []);


    useEffect(() => {
        if (data) {
            setItemSubtotal(parseFloat(data.price) * quantity)
        }
    }, [data, quantity]);

    useEffect(() => {
        props.setSubtotal({ ...props.subtotal, [props.id]: itemSubtotal })
    }, [itemSubtotal]);

    function handleDeleteItem(menuitemId: number) {
        let cart: any = {};

        const cartString = sessionStorage.getItem("Cart");
        if (cartString !== null) {
            cart = JSON.parse(cartString);
        }

        if (menuitemId in cart) {

            // Makes sure to delete the item once there's 0 quantity
            if (cart[menuitemId] > 1) {
                cart[menuitemId] -= 1
                setQuantity((old) => old - 1);
            } else {
                delete cart[menuitemId];
                props.setSubtotal({...props.subtotal, [props.id]: 0})
            }

            sessionStorage.setItem("Cart", JSON.stringify(cart));

            // Update the state to reflect the changes
            props.setOrderedItems(cart);
        }

        const deleteFromCartEvent = new CustomEvent("delete-from-cart");
        window.dispatchEvent(deleteFromCartEvent);
    }

    return (
        data === undefined ?
            <div>Loading</div>
            :
            <tr className="border-b">
                <td className={`text-left font-semibold py-5`}  >
                    <Link href={`/menu/view/${props.id}`} className={"flex items-center gap-5"}>
                        <img className={"rounded-lg"} src={data.image} height={100} width={100} />
                        <span>
                            <h4>{data.name}</h4>
                            <div className={"text-xs font-medium text-wahaca-teal max-w-xl truncate"}>
                                {data.description}
                            </div>
                        </span>
                    </Link>
                </td>
                <td className={"text-right text-sm italic text-wahaca-light-navy"} >{props.quantity} serving(s)</td>
                <td className={"text-right text-sm font-semibold italic text-wahaca-light-navy"}>£{parseFloat(data.price).toFixed(2)} </td>
                <td className={`text-right text-lg font-bold italic text-wahaca-navy`}>£{itemSubtotal.toFixed(2)}</td>

                <td className="p-5 text-center">
                    <button className="default-button" onClick={() => handleDeleteItem(props.id)}>Delete</button>
                </td>
            </tr>
            
    )
}