import React, {useEffect, useState} from "react";
import Link from "next/link";
import styles from "./cart.module.css";
import {BrowserCartObject} from "@/types";

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
export default function Cart(props: Props) {

    const [orderedItems, setOrderedItems] = useState<BrowserCartObject | null | undefined>(undefined);

    // On initial browser load...
    useEffect(() => {
        let cartItems = handleRetrieveFromCart(); // Get items in cart

        // And update state...
        if (Object.keys(cartItems).length === 0) {
            setOrderedItems(null);
        } else {
            setOrderedItems(cartItems);
        }
    }, []);

    /**
     * Gets cart items saved in browser session storage.
     */
    function handleRetrieveFromCart(): BrowserCartObject {
        const cart = sessionStorage.getItem("Cart");
        if (cart === null) {
            return {};
        }
        return JSON.parse(cart);
    }

    const handleSubmit = async (e:any) => {
        e.preventDefault();

        // Using function to obtain data
        const cart = handleRetrieveFromCart();
        if (Object.keys(cart).length ===0) {
            console.log("Cart is Empty, please add items in the Order page")
            return;
        }

        // Format the data as how backend wants
        const orderData = {
            customer_id: 1234,
            time_ordered: new Date().toUTCString(), // Add current time
            table_number: 1,
            items: Object.entries(cart).map(([menuitem_id, quantity]) => ({
                menuitem_id: menuitem_id,
                quantity: quantity
            }))
        };
    
        // Sending the data to the Api route
        try {
            const response = await fetch("http://127.0.0.1:5000/api/addorder", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData),
                mode: 'no-cors'
            });
        
        
            if (!response.ok) {
                throw new Error('Failed to add order');
            }

            //clear orderedMenus after the submission has been sent
            sessionStorage.removeItem("Cart");

        } catch (error) {
            console.error('Error adding order');
            alert('Order failed to send');
        }
    }

    return (
        <div className={""}>
			<Link href={"/menu"} className={"text-base text-sky-500 hover:text-sky-600  hover:translate-x-1 hover:ease-in"}>
                Go back to all items
            </Link>
            <br></br>            
            <br></br>
			<h1>CART</h1>
            <div className="grid md:grid-cols-4 md:gap-5">
                <div className="overflow-x-auto md:col-span-3">
                    {orderedItems === undefined ?
                        <p>Loading...</p>
                        : orderedItems === null ?
                            <p>No items in cart</p>
                            :
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
                                        <td className={styles.t_left}>Item_id = {id} </td>
                                        <td className={styles.t_right}>Quantity = {quantity} </td>
                                        <td className={styles.t_right}>Price = {id.price} </td>
                                        <td className="p-5 text-center">
                                            <button className="default-button">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                    }
                    <div className="card p-5">
                        <ul>
                            <li>
                                <div className="pb-3 text-xl">
                                    Subtotal: £ 
                                </div>
                            </li>
                            <li>
                                <button onClick={handleSubmit} className="primary-button w-full" >
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
