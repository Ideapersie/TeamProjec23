import styles from "@/pages/menu/view/cart.module.css";
import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {BrowserCartObject, MenuItem} from "@/types";

interface Props {
    id: number
    quantity: number
    setOrderedItems: Dispatch<SetStateAction<BrowserCartObject | null | undefined>>
}

export default function CartItem(props: Props) {

    const [data, setData] = useState<MenuItem | undefined>();

    function handleDeleteItem(menuitemId: number) {
        let cart: any = {};

        const cartString = sessionStorage.getItem("Cart");
        if (cartString !== null) {
            cart = JSON.parse(cartString);
        }

        if (menuitemId in cart) {

            // Makes sure to delete the item once there's 0 quantity
            cart[menuitemId] > 1 ? cart[menuitemId] -= 1 : delete cart[menuitemId];

            sessionStorage.setItem("Cart", JSON.stringify(cart));

            // Update the state to reflect the changes
            props.setOrderedItems(cart);
        }
    }

    useEffect(() => {
        fetch(`/api/menu/item/${props.id}`)
            .then(r => r.json())
            .then(data => {
                setData(data.item);
            })
            .catch(err => console.error(err));
    }, []);

    return (
        data === undefined ?
            <div>Loading</div>
            :
            <tr className="border-b">
                <td className={styles.t_left}>Item_id = {props.id} </td>
                <td className={styles.t_right}>Quantity = {props.quantity} </td>
                {/* Need to use the price from item ordered */}
                <td className={styles.t_right}>Price = {data.price}</td>

                <td className="p-5 text-center">
                    <button className="default-button" onClick={() => handleDeleteItem(props.id)}>Delete</button>
                </td>
            </tr>
    )
}