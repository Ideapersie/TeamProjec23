import { useState } from "react";
import PageHeader from "@/components/common/text/PageHeader";
import PageTitle from "@/components/common/text/PageTitle";
import PageSubtitle from "@/components/common/text/PageSubtitle";

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

            <form style={{ display: 'flex', flexDirection: 'column', border: '1px solid #ddd', padding: '15px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'}}>
            
                <label style={{color: "var(--blue)", fontWeight: 500}}>Item name
                    <input type="text" style={{border: '1px solid #ddd', color: '#888ea7', width: '100%', marginBottom: '20px', padding: '5px'}}/>
                </label>
                
                <label style={{color: "var(--blue)", fontWeight: 500}}>Item description
                    <input type="text" style={{border: '1px solid #ddd', color: '#888ea7', width: '100%', marginBottom: '20px', padding: '5px'}}/>
                </label>

                <label style={{color: "var(--blue)", fontWeight: 500}}>Item type
                <select style={{border: '1px solid #ddd', color: '#888ea7', fontSize: '16px', backgroundColor: 'white', fontWeight: '500', width: '100%', marginBottom: '20px', padding: '10px'}}>
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
                
                <label style={{color: "var(--blue)", fontWeight: 500}}>Item price
                    <input type="number" min="1" step="any" style={{border: '1px solid #ddd', color: '#888ea7', width: '100%', marginBottom: '20px', padding: '5px'}} />
                </label>
                
                <label style={{color: "var(--blue)", fontWeight: 500}}>Calories
                    <input type="text" style={{border: '1px solid #ddd', color: '#888ea7', width: '100%', marginBottom: '20px', padding: '5px'}}/>
                </label>
                
                <button className={"submit"}>Submit</button>
            
            </form>

        </>
        
    )
}



