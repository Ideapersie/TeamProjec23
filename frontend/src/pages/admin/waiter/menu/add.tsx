import { useState } from "react";
import PageHeader from "@/components/common/text/PageHeader";
import PageTitle from "@/components/common/text/PageTitle";
import PageSubtitle from "@/components/common/text/PageSubtitle";
import styles from "./add.module.css";


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
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [type, setType] = useState('');
    const [calories, setCalories] = useState('');
    const [image, setImage] = useState('');

    /**
     * Send the form data to Flask API route.
     * 
     * @param e The event object.
     */
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        const formData = { name, description, price, type, calories, image };

        try {
            const response = await fetch("http://127.0.0.1:5000/api/additem", {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                console.log('Item added successfully');
            
            } else {
                console.error('Failed to add item');
            }
        } catch (error) {
          console.error('Error:', error);
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
                    <input type="text" name="name" className={styles.input} value={name} onChange={(e) => setName(e.target.value)}/>
                </label>
                
                <label className={styles.label}>Item description
                    <input type="text" name="description" className={styles.input} value={description} onChange={(e) => setDescription(e.target.value)}/>
                </label>

                <label className={styles.label}>Item price
                    <input type="number" name="price" min="1" step="any" className={styles.input} value={price} onChange={(e) => setPrice(e.target.value)}/>
                </label>

                <label className={styles.label}>Calories
                    <input type="text" name="calories" className={styles.input} value={calories} onChange={(e) => setCalories(e.target.value)}/>
                </label>
                
                <label className={styles.label}>Item type
                    <select name="type" className={styles.select} value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="burgers">Burgers</option>
                        <option value="sandwiches">Sandwiches</option>
                        <option value="pizzas">Pizzas</option>
                        <option value="pastas">Pastas</option>
                        <option value="salads">Salads</option>
                        <option value="seafood">Seafood</option>
                        <option value="soups">Soups</option>
                        <option value="desserts">Desserts</option>
                    </select>
                </label>
                
                <label className={styles.label}>Image URL
                    <input type="text" name="image" className={styles.input} value={image} onChange={(e) => setImage(e.target.value)} />
                </label>

                <button type="submit" name="button" value="submit"className={styles.button}>Submit</button>
        
            </form>

        </>
    )

}