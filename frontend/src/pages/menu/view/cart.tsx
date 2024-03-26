import React, {useEffect, useState} from "react";
import Link from "next/link";
import {BrowserCartObject} from "@/types";
import PageSubtitle from "@/components/common/text/PageSubtitle";
import CartItem from "@/pages/menu/view/cart-item";
import {ApiAddOrderResponse} from "@/api.types";
import {useRouter} from "next/router";

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

    const router = useRouter();
    const [orderedItems, setOrderedItems] = useState<BrowserCartObject | null | undefined>(undefined);
    const [showPopup, setShowPopup] = useState(false);
    const [total, setTotal] = useState<{[id: number]: number}>({});

    
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

    async function handleSubmit(e: any) {
        e.preventDefault();

        // Using function to obtain data
        const cart = handleRetrieveFromCart();
        if (Object.keys(cart).length === 0) {
            console.log("Cart is Empty, please add items in the Order page")
            return;
        }

        // Format the data as how backend wants
        const payload = {
            items: Object.entries(cart).map(([menuitem_id, quantity]) => ({
                menuitem_id: menuitem_id,
                quantity: quantity
            }))
        };

        // Sending the data to the Api route
        try {
            const response = await fetch("/api/addorder", {
                method: 'POST',
                body: JSON.stringify(payload),
            });

            if (response.status === 200) {

                const data = await response.json() as ApiAddOrderResponse;

                const newOrderId = data.new_order_id;

                handleClearCart()

                setShowPopup(true);

                // Hide popup message after 2 seconds
                setTimeout(() => {
                    setShowPopup(false);

                    // Refreshes the page, updating the cart to be empty
                    setTimeout(() => {
                        router.push(`/customer/orders/${newOrderId}/confirmation`)
                    }, 0);
                }, 1500);

            } else {
                alert("Something went wrong");
            }

        } catch (e) {
            console.error(e);
            alert('Order failed to send');
        }
    }

    function handleClearCart() {
        sessionStorage.removeItem('Cart');
        setOrderedItems(null);
    }
    
    return (
        <div>
            <h1 className={"text-5xl m-0 mb-5"}>CART</h1>

            {orderedItems === undefined ?
                <p>Loading...</p>
                    : orderedItems === null ?
                        <PageSubtitle>No items in cart</PageSubtitle>
                        :
                        <table className="w-full">
                            <thead className="border-b">
                            <tr className="border-b text-lg">
                                <th className={"text-left"}>Product</th>
                                <th className={"text-right"}>Quantity</th>
                                <th className={"text-right"}>Price</th>
                                <th className={"text-right"}>Subtotal</th>
                                <th className="p-2">Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {Object.entries(orderedItems).map(([id, quantity]) => (
                                <CartItem
                                    key={id}
                                    id={parseInt(id)}
                                    quantity={quantity}
                                    setOrderedItems={setOrderedItems}
                                    subtotal={total}
                                    setSubtotal={setTotal}
                                />
                            ))}
                            </tbody>
                        </table>
            }

            <div className="card mt-5">
                <div>
                    <div>
                        <div className="pb-3 text-xl font-bold text-wahaca-navy" style={{fontFamily: "sans-serif"}}>
                            Total: £{Object.values(total).reduce((partialSum, a) => partialSum + a, 0).toFixed(2)}
                        </div>
                    </div>

                    <div>
                        <div>
                            <button onClick={handleClearCart} className={"m-0 mr-2 bg-wahaca-teal"}>Clear cart</button>

                            <Link href={"/menu"}>
                                <button className={"bg-white text-wahaca-teal m-0"}>Go back to all items</button>
                            </Link>
                        </div>

                        <button onClick={handleSubmit} className="primary-button">
                            Proceed to checkout
                        </button>
                    </div>
                </div>
                {showPopup && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                        <div className="bg-gray-100 p-5 rounded-lg">
                            <p className="text-center text-xl font-bold text-wahaca-pink">Order Sent!</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
