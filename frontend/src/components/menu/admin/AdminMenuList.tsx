import AdminMenuItem from "@/components/menu/admin/AdminMenuItem";
import styles from "./AdminMenu.module.css";
import Link from "next/link";
import {MenuItem} from "@/types";

// Describing what data should be passed in as props
interface Props {
    dishes: MenuItem[]
}

/**
 * This component represents our Menu i.e. a list of dishes with some filtering options
 */
export default function AdminMenuList(props: Props) {
    return (
        // Styling for the menu can be added in the AdminMenu.module.css file
        <div className={styles.menuList}>
            <div className={styles.menuListTopRow}>

                {/*Filters*/}
                <div className={styles.menuItemFilters}>
                    <select name="" id="" className={styles.select}>
                        <option value="" className="font-subtitle font-bold">Type</option>
                    </select>

                    <select name="" id="" className={styles.select}>
                        <option value="" className="font-subtitle font-bold">Price</option>
                    </select>

                    <select name="" id="" className={styles.select}>
                        <option value="" className="font-subtitle font-bold">Sort</option>
                    </select>

                </div>
            </div>

            {/*Displays each item/dish/drink in the menu*/}
            {
                props.dishes.slice().reverse().map((dish, i) => (
                    <>
                        {i !== 0 && <hr/>}
                        <AdminMenuItem item={dish} key={dish.menuitem_id}/>
                    </>
                ))
            }
        </div>
    );
}
