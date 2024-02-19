import MockData from "../../../mockdata/menu-data.json";
import styles from "./Menu.module.css";
import styles from "./AdminMenu.module.css";

// Describing the props to be passed in to AdminMenuItem
interface Props {
    item: typeof MockData[0]
}

/**
 * Represents a specific item on the menu e.g. a dish, or a drink
 */
export default function AdminMenuItem(props: Props) {
    return (
        <div className={styles.menuItem}>

            {/*Menu item image*/}
            <div className={"menu-item-image-container"}>

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
                
                .menu-item-image-container {
                    background-color: var(--grey-1);
                    border-radius: 10px;
                    width: 125px;
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