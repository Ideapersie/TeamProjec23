import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router"
import {MenuItem} from "@/types";
import styles from "./[id].module.css";


/**
 * The props to be passed to our ItemPage page component.
 */
interface PageProps {
    data: MenuItem | MenuItem;
}

/**
 * Renders page for viewing a single menu item.
 *
 * @constructor
 * @author Vincent Chapman-Andrews (zlac465@live.rhul.ac.uk)
 */
export default function ItemPage(props: PageProps) {

    const router = useRouter();

    function handleAddToCart(){

        let cartString = sessionStorage.getItem("Cart")

        if (cartString === null) {

            cartString = "{}"

            sessionStorage.setItem("Cart", JSON.stringify({}))
        }
        
        const cart = JSON.parse(cartString)
        const id = props.data.menuitem_id

        if (id in cart) {
            cart[id] += 1

        } else {
            cart[id] = 1
        }

        sessionStorage.setItem("Cart",JSON.stringify(cart))

    }

    return (
        <section className = {"min-h-screen flex flex-col"}>
            <button className = {"bg-white text-base text-sky-500"} onClick={() => router.back()}>Go back</button>

            <div className = {"flex gap-8 pb-8"}>
                <div className = {"mt-5 mb-5 p-10 rounded-xl bg-white shadow-lg"} style = {{height:500 ,width:600}}>
                    <div style={{
                            height: "100%",
                            width: "100%",
                            background: `url(${props.data.image})`,
                            backgroundPosition: "center",
                            backgroundSize: "contain",
                            backgroundRepeat: "no-repeat",
                    }}/>
                </div>
                <div className={"flex flex-col gap-5 pt-10"}>
                    <div className={styles.name}>{props.data.name}</div>
                    <div className={styles.description}>{props.data.description}</div>
                    <div className={styles.price}>Price: £{props.data.price}</div>
                    <div className={styles.calories}>Calories: {props.data.calories} Cal</div>
                    <div> 
                        <button onClick={(handleAddToCart)} className={`${styles.button} 
                        text-lg text-white-500 hover:bg-white-300 hover:translate-x-1`}> ORDER NOW </button>
                    </div>
                </div>
            </div>  

            <hr className = {"border-gray-300"}></hr>
            <div className = {"grid grid-cols-2 pt-5 flex-grow"}>
                <p> 
                    <h1 className = {"text-lg text-bold font-bold font-style: italic"}> DESCRIPTION </h1>
                    "Delicious burger with beef patty from local cows fed with organic grass, cows raised in northern 
                    England in perfect conditions for growth. Our sauce is also housemade prepared with daily ingredients for a fresh flavour" 
                </p>
                <div className = {"border-l border-gray-300 pl-10"}> 
                    <ol className = {"list-disc"}> 
                        <h1 className = {"text-lg text-bold font-bold font-style: italic"}> INGREDIENTS </h1>
                        <li> Burger Bun </li>
                        <li> Patty </li>
                        <li> Lettuce </li>
                        <li> Tomato </li>
                        <li> Onions </li>
                        <li> Pickles </li>
                        <li> Cheddar Cheese </li>
                        <li> Burger Sauce </li>
                    </ol>
                </div>
            </div>
            {/* Need to add more like this section, like alike food type */}
        </section>
    )
}

/**
 * Fetch menu item data on server
 */
export async function getServerSideProps(context: GetServerSidePropsContext): Promise<{ props: PageProps }> {

    const id = context.query.id as string;

    const response = await fetch("http://127.0.0.1:5000/api/menuitems"); //New api route returning specific details for id
    let allMenuItems = (await response.json()) as MenuItem[];

    const menuItem = allMenuItems.find(item => {
        return item.menuitem_id === parseInt(id);
    }) || null;

    return {
        props: {
            data: menuItem,
        }
    }
}
