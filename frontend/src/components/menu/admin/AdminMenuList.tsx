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
                    <select name="" id="">
                        <option value="">Type</option>
                    </select>

                    <select name="" id="">
                        <option value="">Price</option>
                    </select>

                    <select name="" id="">
                        <option value="">Sort</option>
                    </select>

                    <button>
                        <Link href="/admin/waiter/menu/add">Add item</Link>
                    </button>
                </div>
            </div>

            {/*TODO: Eventually add item filters here*/}

            {/*Displays each item/dish/drink in the menu*/}
            {
                // .map loops through the list of dishes passed in as props
                props.dishes.map((dish, i) => (
                    // and uses the data for each dish to create a AdminMenuItem component
                    <>
                        {i !== 0 && <hr/>}
                        <AdminMenuItem item={dish} key={dish.menuitem_id}/>
                    </>
                ))
            }
        </div>
    );
}
