import { useState } from "react";
import PageHeader from "@/components/common/text/PageHeader";
import PageTitle from "@/components/common/text/PageTitle";
import PageSubtitle from "@/components/common/text/PageSubtitle";
import styles from "./add.module.css";
import {useRouter} from "next/router";

type Payload = {
    name: string,
    description: string,
    type: string,
    price: string,
    calories: string,
    spice: string,
    image: string
}

/**
 * A form to add a new food item to the menu.
 * 
 * @return The add item form.
 * @author Madeleine Huebner (Madeleine.Huebner.2022@live.rhul.ac.uk)
 */
export default function AddItemPage() {

    const router = useRouter();

    /**
     * Manage the state of the elements.
     * Update value of variable when form is submitted.
     */
    const [newItem, setNewItem] = useState<Payload>({
        name: '',
        description: '',
        type: '',
        price: '0',
        calories: '0',
        image: '',
        spice: '0'
    });

    const handleChange = (e: any) => {
        let { name, value } = e.target;
        setNewItem({ ...newItem, [name]: value });
    };

    /**
     * Send the form data to Flask API route.
     * 
     * @param e The event object representing the form submission event.
     */
    const handleSubmit = async (e: any) => {

        e.preventDefault();

        try {
            const response = await fetch('/api/menu/item/add', {
                method: 'POST',
                body: JSON.stringify(newItem),
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: 'no-cors'
            });

            if (response.status === 200) {
                await router.push('/admin/waiter/menu/view');

            } else if (response.status === 400) {
                alert("Item with this name already exists");

            } else {
                alert("Something went wrong");
            }

        } catch (e) {
            console.error(e);
        }
    }

    /**
     * Present the form to the user.
     */
    return (
        <>
            <PageHeader>
                <PageTitle>
                    Add an item
                </PageTitle>
                <PageSubtitle>
                    Add a new item to the menu.
                </PageSubtitle>
            </PageHeader>

            <form onSubmit={handleSubmit} className={styles.form}>

                <label className={styles.label}>Item name
                    <input type="text" name="name" className={styles.input} value={newItem.name} onChange={handleChange}
                           required/>
                </label>

                <label className={styles.label}>Item description
                    <input type="text" name="description" className={styles.input} value={newItem.description}
                           onChange={handleChange} required/>
                </label>

                <label className={styles.label}>Item price
                    <input type="number" name="price" min="1" step="any" className={styles.input} value={newItem.price}
                           onChange={handleChange} required/>
                </label>

                <label className={styles.label}>Calories
                    <input type="number" name="calories" className={styles.input} value={newItem.calories}
                           onChange={handleChange} required/>
                </label>

                <label className={styles.label}>Item type
                    <select
                        name="type" className={styles.select}
                        value={newItem.type} onChange={handleChange}
                        required
                    >
                        <option value="" disabled>Select a food type</option>
                        <option value="Burgers">Burgers</option>
                        <option value="Sandwiches">Sandwiches</option>
                        <option value="Pizzas">Pizzas</option>
                        <option value="Pastas">Pastas</option>
                        <option value="Salads">Salads</option>
                        <option value="Seafood">Seafood</option>
                        <option value="Soups">Soups</option>
                        <option value="Desserts">Desserts</option>
                    </select>
                </label>

                <label className={styles.label}>Spice level
                    <select name="spice" className={styles.select} value={newItem.spice} onChange={handleChange}>
                        <option value={"0"}>None</option>
                        <option value={"1"}>Mild</option>
                        <option value={"2"}>Medium</option>
                        <option value={"3"}>Hot</option>
                    </select>
                </label>

                <label className={styles.label}>Image URL
                    <input type="text" name="image" className={styles.input} value={newItem.image}
                           onChange={handleChange} required/>
                </label>

                <button type="submit" name="button" value="submit" className={styles.button}>Submit</button>
            </form>
        </>
    )
}