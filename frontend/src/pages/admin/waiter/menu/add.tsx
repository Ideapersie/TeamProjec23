import { useState } from "react";
import PageHeader from "@/components/common/text/PageHeader";
import PageTitle from "@/components/common/text/PageTitle";
import PageSubtitle from "@/components/common/text/PageSubtitle";
import styles from "./add.module.css";


/**
 * A form to add a new food item to the menu.
 */
export default function AddItemPage() {

    const [buttonText, setButtonText] = useState('Submit');

    // Get user input from the form.
    function handleSubmit(event) {

        // Prevent page refresh (default behaviour of button).
        event.preventDefault();

        // Change name of button to "Submitted" for user feedback.
        setButtonText('Submitted!');
        setTimeout(() => {
            setButtonText('Submit');
        }, 2000);

        const formData = new FormData(event.target);
        const name = formData.get("name");
        const description = formData.get("description");
        const image = formData.get("image");
        const type = formData.get("type");
        const price = formData.get("price");
        const calories = formData.get("calories");
    }

    // Present the form to the user.
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
                    <input type="text" name="name" className={styles.input}/>
                </label>
                
                <label className={styles.label}>Item description
                    <input type="text" name="description" className={styles.input}/>
                </label>

                <label className={styles.label}>Image URL
                    <input type="text" name="image" className={styles.input}/>
                </label>
                
                <label className={styles.label}>Item type
                    <select name="type" className={styles.select}>
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
                
                <label className={styles.label}>Item price
                    <input type="number" name="price" min="1" step="any" className={styles.input}/>
                </label>
                
                <label className={styles.label}>Calories
                    <input type="text" name="calories" className={styles.input}/>
                </label>

                <button type="submit" name="button" value="submit"className={styles.button}>{buttonText}</button>
        
            </form>

        </>
    )

}