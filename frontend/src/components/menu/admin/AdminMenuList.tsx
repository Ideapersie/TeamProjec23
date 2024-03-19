import AdminMenuItem from "@/components/menu/admin/AdminMenuItem";
import styles from "./AdminMenu.module.css";
import {MenuItem} from "@/types";
import {useEffect, useState} from "react";

// Describing what data should be passed in as props
interface Props {
    dishes: MenuItem[]
}

/**
 * This component represents our Menu i.e. a list of dishes with some filtering options
 */
export default function AdminMenuList(props: Props) {

    const [items, setItems] = useState(props.dishes);
    const [selectedType, setSelectedType] = useState<string>("");
    const [existingTypes, setExistingTypes] = useState<string[] | undefined>();

    useEffect(() => {
        setItems(props.dishes.filter(item => {
            if (selectedType && item.type !== selectedType) {
                return false;
            }
            return true;
        }))
    }, [selectedType]);

    useEffect(() => {
        fetch("/api/menu/types")
            .then(r => r.json())
            .then(data => {
                setExistingTypes(data.types || []);
            })
            .catch(err => console.error(err));
    }, []);

    return (
        // Styling for the menu can be added in the AdminMenu.module.css file
        <div className={styles.menuList}>
            <div className={styles.menuListTopRow}>

                {/*Filters*/}
                <div className={styles.menuItemFilters}>
                    <select className={styles.select}
                            value={selectedType}
                            onChange={e => setSelectedType(e.currentTarget.value)}
                    >
                        <option value={""} className="font-subtitle font-bold">Filter type</option>
                        {existingTypes?.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>

                    <select name="" id="" className={styles.select}>
                        <option value="" className="font-subtitle font-bold">Sort</option>
                    </select>

                </div>
            </div>

            {/*Displays each item/dish/drink in the menu*/}
            {
                items.slice().reverse().map((dish, i) => (
                    <div key={dish.menuitem_id}>
                        {i !== 0 && <hr/>}
                        <AdminMenuItem item={dish}/>
                    </div>
                ))
            }
        </div>
    );
}
