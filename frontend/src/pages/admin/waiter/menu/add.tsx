import { useState } from "react";
import PageHeader from "@/components/common/text/PageHeader";
import PageTitle from "@/components/common/text/PageTitle";
import PageSubtitle from "@/components/common/text/PageSubtitle";
import styles from "./add.module.css";

export default function AddItemPage() {
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

            <form className={styles.form}>
            
                <label className={styles.label}>Item name
                    <input type="text" className={styles.input}/>
                </label>
                
                <label className={styles.label}>Item description
                    <input type="text" className={styles.input}/>
                </label>

                <label className={styles.label}>Image URL
                    <input type="text" className={styles.input}/>
                </label>
                
                <label className={styles.label}>Item type
                    <select className={styles.select}>
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
                    <input type="number" min="1" step="any" className={styles.input}/>
                </label>
                
                <label className={styles.label}>Calories
                    <input type="text" className={styles.input}/>
                </label>
                
                <button className={"submit"}>Submit</button>
            
            </form>

        </>
        
    )
}



