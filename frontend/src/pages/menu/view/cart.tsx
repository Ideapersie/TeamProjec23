import React, {useEffect, useState} from "react";
import Link from "next/link";
import styles from "./cart.module.css";
import {BrowserCartObject} from "@/types";
import PageSubtitle from "@/components/common/text/PageSubtitle";
import CartItem from "@/pages/menu/view/cart-item";

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
    const [showPopup, setShowPopup] = useState(false);
    const [subtotal, setSubtotal] = useState<{[id: number]: number}>({});

    
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

    //Gets cart items saved in browser session storage.
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

            //Removes the order in browser storage after checkout. 
            sessionStorage.removeItem("Cart");

        } catch (e) {
            console.error(e);
            alert('Order failed to send');
        }

        setShowPopup(true);
        // Hide popup message after 2 seconds
        setTimeout(() => {
            setShowPopup(false);
            // Refreshes the page, updating the cart to be empty
            setTimeout(() => {
                window.location.reload();
            }, 0);
        }, 1500);
    }
    
    return (
        <div>
			<Link href={"/menu"} className={"text-base text-wahaca-teal hover:text-wahaca-blue"}>
                Go back to all items
            </Link>

            <br></br>            
            <br></br>
			<h1 className = "text-4xl pl-3"> CART </h1>
            <div className="grid md:grid-cols-4 md:gap-5">
                <div className="overflow-x-auto md:col-span-3">
                    {orderedItems === undefined ?
                        <p>Loading...</p>
                        : orderedItems === null ?
                            <PageSubtitle>No items in cart</PageSubtitle>
                            :
                            <table className="min-w-full">
                                <thead className="border-b">
                                <tr className="border-b">
                                    <th className={styles.t_left}>Product</th>
                                    <th className={styles.t_right}>Quantity</th>
                                    <th className={styles.t_right}>Price</th>
                                    <th className={styles.t_right}>Total Price</th>
                                    <th className="p-5">Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {Object.entries(orderedItems).map(([id, quantity]) => (
                                    <CartItem
                                        key={id}
                                        id={parseInt(id)}
                                        quantity={quantity}
                                        setOrderedItems={setOrderedItems}
                                        subtotal={subtotal}
                                        setSubtotal={setSubtotal}
                                    />
                                ))}
                                </tbody>
                            </table>
                    }
                    <div className="card p-5">
                        <ul>
                            <li>
                                <div className="pb-3 text-xl" style={{fontFamily: "sans-serif"}}>
                                    Subtotal: £{Object.values(subtotal).reduce((partialSum, a) => partialSum + a, 0).toFixed(2)}
                                </div>
                            </li>
                            <li>
                                <button onClick={ handleSubmit} className="primary-button w-full" >
                                    Proceed to checkout
                                </button>
                            </li>
                        </ul>
                        {showPopup && (
                            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                                <div className="bg-gray-100 p-5 rounded-lg">
                                    <p className="text-center text-xl font-bold text-wahaca-pink">Order Sent!</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
