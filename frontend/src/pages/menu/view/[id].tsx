import {GetServerSidePropsContext} from "next";
import {useRouter} from "next/router"
import {Ingredient, MenuItem} from "@/types";
import styles from "./[id].module.css";
import Link from "next/link";

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

    }

    return (
        <section>
            <div className={"flex justify-between"}>
                <div>
                    <button className={"bg-white text-lg text-sky-500 shadow-none"} onClick={() => router.back()}>
                        Go back
                    </button>
                </div>
                <Link href={"/menu/view/cart"}>
                    <img className="hover:rounded-lg hover:border-2 border-slate-200" alt="cart"
                         src="https://i.postimg.cc/kgQHTvcK/istockphoto-1204513100-612x612.jpg" width="100"
                         height="100"></img>
                </Link>
            </div>

            <div className={"min-h-screen flex-col"}>
                <div className={"flex gap-8 pb-8"}>
                    <div className={"mt-5 mb-5 p-10 rounded-xl bg-white shadow-lg"} style={{height: 500, width: 600}}>
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
                        <div className={styles.price}>Price: £{props.data.price}</div>
                        <div className={styles.calories}>Calories: {props.data.calories} Cal</div>
                        <div>
                            <button onClick={(handleAddToCart)} className={`${styles.button} 
                            text-lg text-white-500 hover:bg-white-300 hover:translate-x-1`}> ORDER NOW
                            </button>
                        </div>
                    </div>
                </div>

                <hr className={"border-gray-300"}></hr>

                <div className={"grid grid-cols-2 pt-5 flex-grow"}>
                    <div>
                        <h1 className={"text-lg text-bold font-bold font-style: italic"}> DESCRIPTION </h1>
                        <p>
                            Delicious burger with beef patty from local cows fed with organic grass, cows raised in
                            northern
                            England in perfect conditions for growth. Our sauce is also housemade prepared with daily
                            ingredients for a fresh flavour
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
                                        <li key={index}>{ingredient.allergen && <span>, {ingredient.allergen}</span>}</li>
                                    ))
                                ) : (
                                    <li>No allergens</li>
                                )}
                            </ol>
                    </div>
                </div>
                <br></br>
                <br></br>
                <div>
                    <h1 className = {"text-center font-semibold "}> Related Food Items: {props.data.type}</h1>

                    <div className= "grid grid-cols-2 gap-4 ">
                        {props.data.related.map((related,index) => (
                            <div key={index} className = "grid grid-rows-2 text-center items-center tracking-wide rounded-xl bg-white shadow-lg">
                                {/* Makes the image centered */}
                                <div className="flex justify-center"> 
                                {/* Need to imrpove: Click goes to that item */}
                                    <Link href = {"/menu/"}>
                                        <img src={related.image} width="400" height="400" />
                                    </Link>
                                </div>
                                <div >
                                    <h2 className = "text-xl font-semibold">{related.name}</h2>
                                        <p>{"£"+ related.price}</p>
                                        <p>{related.calories+" Cal"}</p>
                                </div>
                            </div>
                        ))}
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
