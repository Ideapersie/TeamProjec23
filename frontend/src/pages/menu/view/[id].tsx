import {GetServerSidePropsContext} from "next";
import {useRouter} from "next/router"
import {Ingredient, MenuItem} from "@/types";
import styles from "./[id].module.css";
import Link from "next/link";
import { useState } from "react";
import {CartButton} from "@/components/cart-button";
import { CustomerMenuItem } from "@/components/menu/customer/CustomerMenuItem";

/**
 * Adds to menu item type to mirror response from api.
 */
type MenuItemWithIngredientsAndRelated = MenuItem & {
    ingredients: Ingredient[],
    related: MenuItem[]
}

/**
 * The props to be passed to our ItemPage page component.
 */
interface PageProps {
    data: MenuItemWithIngredientsAndRelated | null;
}

/**
 * Renders page for viewing a single menu item.
 *
 * @constructor
 * @author Idea Khan (zlac177@live.rhul.ac.uk), Vincent Chapman-Andrews (zlac465@live.rhul.ac.uk)
 */
export default function ItemPage(props: PageProps) {

    const router = useRouter();
    const [showPopup, setShowPopup] = useState(false);

    if (props.data === null) {
        return <>Item does not exist</>
    }
    
    function handleAddToCart() {
        if (props.data === null) {
            return;
        }

        let cartString = sessionStorage.getItem("Cart")

        if (cartString === null) {

            cartString = "{}"

            sessionStorage.setItem("Cart", JSON.stringify({}))
        }

        const cart = JSON.parse(cartString)
        const id = props.data.menuitem_id;

        if (id in cart) {
            cart[id] += 1

        } else {
            cart[id] = 1
        }

        sessionStorage.setItem("Cart", JSON.stringify(cart))

        setShowPopup(true);
        // Hide popup message after 2 seconds
        setTimeout(() => {
            setShowPopup(false);
        }, 2000);

        const addToCartEvent = new CustomEvent("add-to-cart");
        window.dispatchEvent(addToCartEvent);
    }

    return (
        <section>
            <div className={"flex justify-between"}>
                <div>
                    <button className={"bg-white text-lg text-wahaca-teal hover:text-wahaca-blue"} onClick={() => router.back()}>
                        Go back
                    </button>
                </div>
                <CartButton/>
            </div>

            <div className={"min-h-screen flex-col"}>
                <div className={"flex gap-8 pb-8"}>
                    <div className={"mb-5 p-5 rounded-xl bg-white shadow-lg"} style={{height: 450, width: 600}}>
                        <div style={{
                            height: "100%",
                            width: "100%",
                            background: `url(${props.data.image})`,
                            backgroundPosition: "center",
                            backgroundSize: "contain",
                            backgroundRepeat: "no-repeat",
                        }}/>
                    </div>
                    {/* Flex column to contain item info */}
                    <div className={"flex flex-col gap-5 pt-10"}>
                        <div className={styles.name}>{props.data.name}</div>
                        <div className={styles.description}>{props.data.description}</div>
                        <div className={styles.price}>Price: £{parseFloat(props.data.price).toFixed(2)}</div>
                        <div className={styles.calories}>Calories: {props.data.calories} Cal</div>
                        <div>
                            <button onClick={(handleAddToCart)} className={`${styles.button} 
                                text-lg text-white-500 hover:bg-white-300 hover:translate-x-1`}> ORDER NOW
                            </button>

                            {showPopup && (
                                <div className="static bg-wahaca-teal text-white p-2 rounded-lg">
                                    Order added to cart
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <hr className={"border-gray-300"}></hr>

                <div className={"grid grid-cols-2 pt-5 pl-5 flex-grow"}>
                    <div>
                        <h1 className={"text-lg text-bold font-bold font-style: italic"}> DESCRIPTION </h1>
                        <p>
                            Delicious burger with beef patty from local cows fed with organic grass, cows raised in
                            northern
                            England in perfect conditions for growth. Our sauce is also housemade prepared with daily
                            ingredients for a fresh flavour.
                        </p>
                    </div>

                    <div className={"border-l border-gray-300 pl-10"}>
                        <h1 className={"text-lg text-bold font-bold font-style: italic"}> INGREDIENTS </h1>
                        <ol className={"list-disc"}>
                            {props.data.ingredients.map((ingredient, index) => (
                                <li key={index}>{ingredient.name}</li>
                            ))}
                        </ol>

                        <br></br>
                        <h1 className={"text-lg text-bold font-bold italic"}>ALLERGENS</h1>
                            <ol className={"list-disc"}>
                                {props.data.ingredients.some(ingredient => ingredient.allergen) ? (
                                    props.data.ingredients.map((ingredient, index) => (
                                        ingredient.allergen && ingredient.allergen.trim() !== '' && (
                                            <li key={index}>{ingredient.allergen && <span>{ingredient.allergen}</span>}</li>
                                        )
                                    ))
                                ) : (
                                    <li> No allergens </li>
                                )}
                            </ol>
                    </div>
                </div>
                <br></br>
                <br></br>
                <div>
                    <h1 className = {"text-lg text-center text-wahaca-navy"}> Related Food Items : 
                        <span className = {"text-xl font-semibold text-wahaca-pink tracking-wider"}> {props.data.type}</span>
                    </h1>
                    
                    {/*Displaying menu items*/}
                    <div className={"grid grid-cols-3 gap-10"}>
                        {props?.data?.related?.length ?
                            props.data.related.slice().reverse().map(item => (
                                <CustomerMenuItem
                                    key={item.menuitem_id}
                                    data={item}
                                />
                            ))
                            :
                            <div className={"bg-white shadow rounded-lg px-3 py-2 text-mg text-wahaca-navy font-bold"}>
                                No items for this food type
                            </div>
                        }
                    </div>
                </div>
            </div>
        </section>
    )
}

/**
 * Fetch menu item data on server
 */
export async function getServerSideProps(context: GetServerSidePropsContext): Promise<{ props: PageProps }> {

    const id = context.query.id as string;

    const response = await fetch(`http://127.0.0.1:5000/api/menu/item/${id}`);
    let menuItem: MenuItemWithIngredientsAndRelated | null = null;

    if (response.status === 200) {
        const data = await response.json();
        menuItem = data.item || null;
    }

    return {
        props: {
            data: menuItem,
        }
    }
}
