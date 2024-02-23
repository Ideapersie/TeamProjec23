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

    return (
        <>
            <button className={"text-base text-white-500 background-color:white hover:text-white-600  hover:ml-0.5 hover:ease-in"} onClick={() => router.back()}>Go back</button>

            {/* <pre>{JSON.stringify(props, undefined, 2)}</pre> // temporary display for each data items */}

            {/* <h1 className = {""}>
                {props.data.name}    
            </h1> */}
                <div className={"mt-5 mb-5 rounded-xl bg-white shadow-lg"} style={{
                        height: 500,
                        width: 500,
                        background: `url(${props.data.image})`,
                        backgroundPosition: "center",
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat"
                }}/>
                <div className={"grid grid-cols-1 gap-3"}>
                    <div className={styles.name}>{props.data.name}</div>
                    <div className={styles.description}>{props.data.description}</div>
                    <div className={styles.price}>Price: £{props.data.price}</div>
                    <div className={styles.calories}>Calories: {props.data.calories} Cal</div>
                </div>
        </>
    )
}

/**
 * Fetch menu item data on server
 */
export async function getServerSideProps(context: GetServerSidePropsContext): Promise<{ props: PageProps }> {

    const id = context.query.id as string;

    const response = await fetch("http://127.0.0.1:5000/api/menuitems");
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