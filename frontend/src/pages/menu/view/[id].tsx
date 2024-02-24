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

            {/* <pre>{JSON.stringify(props, undefined, 2)}</pre> // temporary display for each data items */}
            <div className = {"flex gap-10"}>
                <div className = {"mt-5 mb-5 p-10 rounded-xl bg-white shadow-lg"} style = {{height:500 ,width:600}}>
                    <div style={{
                            height: "100%",
                            width: "100%",
                            background: `url(${props.data.image})`,
                            backgroundPosition: "center",
                            backgroundSize: "contain",
                            backgroundRepeat: "no-repeat"
                    }}/>
                </div>
                <div className={"flex flex-col gap-5"}>
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

            <hr/>
            <div className = {"grid grid-cols-2 p-5 flex-grow "}>
                <div>DESCRIPTION</div>
                <div className = {"border-l border-white-500 pl-5"}> INGREDIENTS </div> {/* Currently need to hard code ingredients */}
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
