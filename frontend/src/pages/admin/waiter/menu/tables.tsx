import PageHeader from "@/components/common/text/PageHeader";
import PageTitle from "@/components/common/text/PageTitle";
import styles from "@/components/menu/admin/Tables.module.css";
import { SetStateAction, useEffect, useState } from "react";
import {Order} from "@/types";

/**
 * View table numbers and the corresponding waiters assigned to them.
 * 
 * @returns A component displaying a list of tables with their respective orders.
 * @author Madeleine Huebner (Madeleine.Huebner.2022@live.rhul.ac.uk)
 */

interface Props {
    data: Order[]
}

export default function ViewTablesPage() {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

    const handleClick = (id: number) => {
        setSelectedItemId(id);
        setIsSidebarOpen(true);
    };

    const handleCloseSidebar = () => {
        setIsSidebarOpen(false);
    };

    const [items, setItems] = useState<Order[]>([]);

    useEffect(() => {
        fetchItems().then((data) => {
            setItems(data);
        }).catch((error) => {
            console.error(error);
        });
    }, []);

    async function fetchItems(): Promise<Order[]> {
        try {
            const response = await fetch("/api/fetchorders");
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    /**
     * Present the list of tables.
     */
    return (

        <>
            <PageHeader>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"></link>    
            <PageTitle>
                    TABLES
                </PageTitle>
            </PageHeader>
            
            <div className="grid grid-cols-3 gap-4">
                {[...Array(9)].map((_, index) => (
                    <div
                        key={index}
                        className={styles.tableItem}
                        onClick={() => handleClick(index + 1)}
                    >
                        {index + 1}
                </div>
                ))}
            </div>
            
            {/* Button to fetch orders instead of refreshing page */}
            <button onClick={() => fetchItems().then((data) => setItems(data)).catch((error) => console.error(error))}>
                Fetch Orders
            </button>

            {/* Open a sidebar to display table order information */}
            {isSidebarOpen && (
                <div className={styles.sidebar}>
                    <button className={styles.close} onClick={handleCloseSidebar}>&#10006;</button>
                    <div className={styles.sidebarContent}>
                        <div className="mt-4">
                            <p className={styles.tableNumber}>Table {selectedItemId}</p>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>ORDER</th>
                                        <th>STATUS</th>
                                        <th>TIME</th>
                                        <th>WAITER</th>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Filter by customer id (this is temporary until customer ids are set up along with table numbers) */}
                                    {items && items
                                        .filter(order => order.customer_id === 1234)
                                        .map(order => (
                                            <tr key={order.customer_id}>
                                                <td>{order.order_id}</td>
                                                <td>
                                                    {order.status === 'unconfirmed' && (
                                                        <i className="fas fa-clock"></i>
                                                    )}
                                                    {order.status !== 'unconfirmed' && order.status}
                                                </td>
                                                <td>{new Date(order.time_ordered).toLocaleTimeString('en-UK', {hour: '2-digit', minute: '2-digit'})}</td>
                                                <td>name</td>
                                                <td>
                                                    <button>
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                </td>
                                                <td>
                                                    <button className={styles.confirm}>Confirm</button>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}