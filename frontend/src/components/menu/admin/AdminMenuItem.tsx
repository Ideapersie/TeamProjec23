import styles from "./AdminMenu.module.css";
import {MenuItem} from "@/types";
import Link from "next/link";

// Describing the props to be passed in to AdminMenuItem
interface Props {
    item: MenuItem
}

/**
 * Represents a specific item on the menu e.g. a dish, or a drink
 */
export default function AdminMenuItem(props: Props) {
    return (
        <div className={styles.menuItem}>

            {/*Menu item image*/}
            <div className={"bg-white w-36 rounded-xl shadow overflow-hidden p-3"}>
                <div
                    className={"h-full !bg-contain !bg-center !bg-no-repeat"}
                    style={{background: `url(${props.item.image})`}}
                />
            </div>

            {/*Menu item overview*/}
            <div className={styles.menuItemOverview}>
                <h4 className={"mb-px"}>
                    {props.item.name}
                    <span className={"ml-1.5 text-sky-600 font-semibold"}>
                        £{props.item.price}
                    </span>
                </h4>

                <div className={"text-xs font-medium text-sky-900 opacity-50"}>
                    {props.item.type}
                    <span> | </span>
                    {props.item.calories} cals
                </div>

                <div className={"mt-2 text-xs max-w-xl truncate text-sky-900"}>
                    {props.item.description}
                </div>
            </div>

            {/*Menu item controls*/}
            <div className={"ml-auto flex gap-1 items-center text-xs"}>
                <Link href={`/menu/view/${props.item.menuitem_id}`}
                      target={"_blank"}
                >
                    <button className={"m-0 w-full bg-sky-700"}>
                        View Page
                    </button>
                </Link>

                <Link href={`/admin/waiter/menu/edit/${props.item.menuitem_id}`}>
                    <button className={"m-0 w-full bg-emerald-700"}>
                        Edit
                    </button>
                </Link>

                <button
                    className={"m-0 bg-pink-800"}
                    onClick={() => alert("Delete item")}
                >
                    Delete
                </button>
            </div>
        </div>
    )
}