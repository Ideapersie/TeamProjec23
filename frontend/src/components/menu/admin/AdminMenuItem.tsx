import styles from "./AdminMenu.module.css";
import {MenuItem} from "@/types";
import Link from "next/link";
import {useContext} from "react";
import {AdminViewMenuPageContext} from "@/pages/admin/waiter/menu/view";

// Describing the props to be passed in to AdminMenuItem
interface Props {
    item: MenuItem
}

/**
 * Represents a specific item on the menu e.g. a dish, or a drink
 */
export default function AdminMenuItem(props: Props) {

    // Getting context for View Menu Item page
    const PageContext = useContext(AdminViewMenuPageContext);

    return (
        <div className={styles.menuItem}>

            {/*Menu item image*/}
            <div className={"bg-white w-36 rounded-xl overflow-hidden p-3"}>
                <div
                    className={"h-full !bg-contain !bg-center !bg-no-repeat"}
                    style={{background: `url(${props.item.image})`}}
                />
            </div>

            {/*Menu item overview*/}
            <div className={styles.menuItemOverview}>
                <h4 className={"mb-px text-xl"}>
                    {props.item.name}
                    <span className={"ml-1.5 font-sans font-bold"}>
                        £{props.item.price}
                    </span>
                </h4>

                <div className={"font-subtitle text-wahaca-light-navy opacity-80"}>
                    {props.item.type}
                    <span> | </span>
                    <span className={"font-title"}>{props.item.calories}</span> cals
                </div>

                <div className={"mt-2 max-w-xl truncate text-black font-calibri"}>
                    {props.item.description}
                </div>
            </div>

            {/*Menu item controls*/}
            <div className={"ml-auto flex gap-1 items-center "}>
                <Link href={`/menu/view/${props.item.menuitem_id}`}>
                    <button className={"m-0 w-full bg-wahaca-blue"}>
                        View Page
                    </button>
                </Link>

                <Link href={`/admin/waiter/menu/edit/${props.item.menuitem_id}`}>
                    <button className={"m-0 w-full bg-wahaca-teal"}>
                        Edit
                    </button>
                </Link>

                <button
                    className={"m-0 bg-wahaca-pink"}
                    onClick={() => PageContext?.setItemToDelete(props.item)}
                >
                    Delete
                </button>
            </div>
        </div>
    )
}