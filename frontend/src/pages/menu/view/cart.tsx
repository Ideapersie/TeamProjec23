import React from "react";
import Link from "next/link";
import styles from "./cart.module.css";

interface Props {
    name: string
    price: string
    menuitem_id: number
}

/**
 * A Cart page containing all the items added to the basket and their respective details
 * 
 *  @author Idea Khan (zlac177@live.rhul.ac.uk), Alvis Wang (zkac380@live.rhul.ac.uk)
 */

export default function Cart(props:Props) {


    function handleRetrieveFromCart() {

        
        const cart = sessionStorage.getItem("Cart");
        
        if (cart === null){
            return {};
        }
        return JSON.parse(cart)
    }

    const orderedItems = handleRetrieveFromCart();

    return (
        <div className={""}>
			<Link href={"/menu"} className={"text-base text-sky-500 hover:text-sky-600  hover:translate-x-1 hover:ease-in"}>
                    Go back to all items
            </Link>
			<h1>CART</h1>
            <div className="grid md:grid-cols-4 md:gap-5">
                <div className="overflow-x-auto md:col-span-3">
                    <table className="min-w-full">
                        <thead className="border-b">
                            <tr className="border-b">
                                <th className={styles.t_left}>Product</th>
                                <th className={styles.t_right}>Quantity</th>
                                <th className={styles.t_right}>Price</th>
                                <th className="p-5">Action</th> 
                            </tr>
                        </thead>
                            <tbody>
                                {Object.entries(orderedItems).map(([id, quantity]) => (
                                    <tr key={id} className="border-b">
                                        <td className={styles.t_left}>name={id.name} </td>
                                        <td className={styles.t_right}>quantity = {quantity} </td>
                                        <td className={styles.t_right}>price={id.price} </td>
                                        <td className="p-5 text-center">
                                            <button className="default-button">Delete</button>
                                        </td>
                                    </tr>
                                ))} 
                            </tbody>
                    </table>
                <div className="card p-5">
                    <ul>
                        <li>
                            <div className="pb-3 text-xl">
                                Subtotal: £
                            </div>
                        </li>
                        <li>
                            <button className="primary-button w-full">
                                Proceed to checkout
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>  
    );
}
