import {GetServerSidePropsContext} from "next";
import {useRouter} from "next/router"
import {Ingredient, MenuItem} from "@/types";
import styles from "./[id].module.css";
import { useState } from "react";
import { CustomerMenuItem } from "@/components/menu/customer/CustomerMenuItem";
import AllergenSummary from "@/components/allergens/AllergenSummary";

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
            </div>

            <div className={"min-h-screen flex-col"}>
                <div className={"flex gap-12 items-center pb-8"}>
                    <div className={"rounded-xl bg-white shadow-lg self-stretch flex-grow overflow-hidden max-w-2xl"}>
                        <div style={{
                            height: "100%",
                            width: "100%",
                            background: `url(${props.data.image})`,
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                            backgroundRepeat: "no-repeat",
                        }}/>
                    </div>

                    {/* Flex column to contain item info */}
                    <div className={"flex flex-col gap-2 py-5"}>
                        <div className={styles.name + " text-wahaca-navy"}>{props.data.name}</div>
                        <div className={styles.description + " text-wahaca-teal"}>{props.data.description}</div>
                        {props.data.spice > 0 &&
                            <div>
                                <span
                                    className={`flex gap-0.5 ${props.data.spice === 3 ? "fill-wahaca-pink" : props.data.spice === 2 ? "fill-amber-500" : "fill-lime-500"}`}>
                                    {Array(props.data.spice).fill(null).map((value, index) => (
                                        <svg key={index} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
                                             height={"1.5rem"}>
                                            {/*Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.*/}
                                            <path
                                                d="M428.3 3c11.6-6.4 26.2-2.3 32.6 9.3l4.8 8.7c19.3 34.7 19.8 75.7 3.4 110C495.8 159.6 512 197.9 512 240c0 18.5-3.1 36.3-8.9 52.8c-6.1 17.3-28.5 16.3-36.8-.1l-11.7-23.4c-4.1-8.1-12.4-13.3-21.5-13.3H360c-13.3 0-24-10.7-24-24V152c0-13.3-10.7-24-24-24l-17.1 0c-21.3 0-30-23.9-10.8-32.9C304.7 85.4 327.7 80 352 80c28.3 0 54.8 7.3 77.8 20.2c5.5-18.2 3.7-38.4-6-55.8L419 35.7c-6.4-11.6-2.3-26.2 9.3-32.6zM171.2 345.5L264 160l40 0v80c0 26.5 21.5 48 48 48h76.2l23.9 47.8C372.3 443.9 244.3 512 103.2 512H44.4C19.9 512 0 492.1 0 467.6c0-20.8 14.5-38.8 34.8-43.3l49.8-11.1c37.6-8.4 69.5-33.2 86.7-67.7z"/>
                                        </svg>
                                    ))}
                                </span>
                            </div>
                        }
                        <div className={styles.price}>Price: £{parseFloat(props.data.price).toFixed(2)}</div>
                        <div className={styles.calories}>Calories: {props.data.calories} Cals</div>
                        <div className={"mt-4 relative"}>
                            <button onClick={(handleAddToCart)} className={`${styles.button} 
                                text-lg text-white-500 m-0 hover:bg-white-300 hover:translate-x-1`}> ORDER NOW
                            </button>

                            {showPopup && (
                                <div className="absolute bg-wahaca-teal text-white p-2 rounded-lg mt-1">
                                    Order added to cart
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className={"flex shadow flex-grow bg-white rounded-xl overflow-hidden"}>
                    <div className={"p-16 bg-wahaca-pink bg-opacity-70 text-white"}>
                        <h4 className={"text-2xl text-wahaca-yellow font-extrabold italic mb-6"}> ABOUT OUR FOOD </h4>
                        <p>
                            Wahaca’s food is inspired by the flavours and dishes of Mexico, using over 200 ingredients,
                            sourced as locally as possible. That&apos;s why we serve some traditional Mexican dishes,
                            alongside others cooked like a Mexican chef might, using ingredients freshly available
                            nearby. We champion our great British suppliers and we add seasonal specials to the menu
                            throughout the year.
                        </p>
                        <br/>
                        <p className={"font-semibold"}>
                            We use free-range chicken and pork, grass-fed beef and sustainable fish, to make sure our
                            dishes featuring meat are delicious and better for the planet too.
                        </p>
                    </div>

                    <div className={"border-l border-gray-300 p-16 flex flex-col gap-6"}>
                        <div>
                            <h4 className={"text-lg text-bold font-bold italic mb-3"}> INGREDIENTS </h4>
                            <div className={"italic text-sm font-medium text-wahaca-teal"}>
                                {props.data.ingredients.map((ingredient, index) => (
                                    <span key={index} className={"mr-1"}>
                                        {ingredient.name}{ingredient.allergen && <strong> ({ingredient.allergen})</strong>}
                                        {index != 0 && ","}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className={"text-lg text-bold font-bold italic mb-4"}>ALLERGENS</h4>
                            <AllergenSummary
                                ingredients={props.data.ingredients}
                                horizontal={true}
                            />
                        </div>
                    </div>
                </div>
                <br></br>
                <br></br>
                <div>
                    <h1 className={"text-lg text-center text-wahaca-navy"}> Related Food Items :
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
