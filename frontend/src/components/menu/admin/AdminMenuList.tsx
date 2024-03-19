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
    const [sortMode, setSortMode] = useState<"cheapest" | "recent" | "alpha">("recent");

    useEffect(() => {

        // Filter items if type specified
        let newItems = props.dishes.filter(item => {
            if (selectedType && item.type !== selectedType) {
                return false;
            }
            return true;
        });

        // Sort items based on specified sorting mode
        newItems.sort((a, b) => {
            switch (sortMode) {
                case "recent":
                    return 0;
                case "alpha":
                    if (a.name < b.name) return 1;
                    else if (a.name === b.name) return 0;
                    else return -1;
                case "cheapest":
                    let aPrice = parseFloat(a.price);
                    let bPrice = parseFloat(b.price);
                    if (aPrice < bPrice) return 1;
                    else if (aPrice === bPrice) return 0;
                    else return -1;
            }
        })

        // Update items displayed
        setItems(newItems);

    }, [selectedType, sortMode]);

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
                    <label>
                        Filter by type
                        <select className={styles.select}
                                value={selectedType}
                                onChange={e => setSelectedType(e.currentTarget.value)}
                        >
                            <option value={""} className="font-subtitle font-bold">All types</option>
                            {existingTypes?.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Sort
                        <select className={styles.select}
                                value={sortMode}
                                onChange={e => setSortMode(e.currentTarget.value as any)}
                        >
                            <option value="recent" className="font-subtitle font-bold">Most recent</option>
                            <option value="cheapest" className="font-subtitle font-bold">Cheapest first</option>
                            <option value="alpha" className="font-subtitle font-bold">Alphabetical</option>
                        </select>
                    </label>

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
