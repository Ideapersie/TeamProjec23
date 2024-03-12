import { useState } from "react";
import PageTitle from "@/components/common/text/PageTitle";
import styles from "@/components/menu/admin/Add.module.css";

/**
 * A form to add a new food item to the menu.
 * 
 * @return The add item form.
 * @author Madeleine Huebner (Madeleine.Huebner.2022@live.rhul.ac.uk)
 */
export default function AddItemPage() {

    /**
     * Manage the state of the elements.
     * Update value of variable when form is submitted.
     */
    const [newItem, setNewItem] = useState({
        name: '',
        description: '',
        type: '',
        price: '',
        calories: '',
        image: ''
    });

    const handleChange = (e:any) => {
        const { name, value } = e.target;
        setNewItem({ ...newItem, [name]: value });
    };

    /**
     * Send the form data to Flask API route.
     * 
     * @param e The event object representing the form submission event.
     */
    const handleSubmit = async (e: any) => {

        e.preventDefault();
        console.log(JSON.stringify(newItem));
        
        const response = await fetch("http://127.0.0.1:5000/api/additem", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newItem),
                mode: 'no-cors'
        })
        .then(response => {
            if (response) {
                console.log('Request sent successfully');
                alert("Menu item successfully added.")
                
            } else {
                console.error('Request failed');
                alert("Adding menu item unsuccessful.")
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    /**
     * Present the form to the user.
     */
    return (
        <>
            <PageTitle>
                ADD NEW ITEM
            </PageTitle>
        
            <form onSubmit={handleSubmit} className={styles.form}>

                <label className={styles.label}>Item name
                    <input type="text" name="name" className={styles.input} value={newItem.name} onChange={handleChange} required/>
                </label>
                
                <label className={styles.label}>Item description
                    <input type="text" name="description" className={styles.input} value={newItem.description} onChange={handleChange} required/>
                </label>

                <label className={styles.label}>Item price
                    <input type="number" name="price" min="1" step="any" className={styles.input} value={newItem.price} onChange={handleChange} required/>
                </label>

                <label className={styles.label}>Calories
                    <input type="number" name="calories" className={styles.input} value={newItem.calories} onChange={handleChange} required/>
                </label>
                
                <label className={styles.label}>Item type
                    <select name="type" className={styles.select} value={newItem.type} onChange={handleChange}>
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
                
                <label className={styles.label}>Image URL
                    <input type="text" name="image" className={styles.input} value={newItem.image} onChange={handleChange} required/>
                </label>

                <button type="submit" name="button" value="submit"className={styles.button}>Submit</button>
            </form>
        </>
    )
}