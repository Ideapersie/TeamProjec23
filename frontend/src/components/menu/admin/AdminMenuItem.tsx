import styles from "./AdminMenu.module.css";
import {MenuItem} from "@/types";

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
                <h4 className={"menu-list-item"}>
                    {props.item.name}
                    <span className={"menu-item-price"}>
                        £{props.item.price}
                    </span>
                </h4>

                <div className={"item-type"}>
                    {props.item.type}
                    <span> | </span>
                    {props.item.calories} cals
                </div>

                <div className={"item-description"}>{props.item.description}</div>
            </div>

            {/*Menu item controls*/}
            <div className={styles.menuItemControls}>
                <button>Edit</button>
                <button>Delete</button>
            </div>

            {/*TODO: Add code for AdminMenuItem react component*/}
            <style jsx>{`
                .menu-list-item {
                    margin-bottom: 1px;
                    
                    .menu-item-price {
                        margin-left: 10px;
                        font-weight: 600;
                        color: var(--accent-1);
                    }
                }

                .item-type {
                    font-size: 0.8rem;
                    font-weight: 500;
                    color: var(--blue);
                    opacity: 50%;
                }
                
                .item-description {
                    margin-top: 10px;
                    font-size: 0.8rem;
                    font-weight: 500;
                    color: var(--grey-2);
                }
            `}</style>
        </div>
    )
}