import PageHeader from "@/components/common/text/PageHeader";
import PageTitle from "@/components/common/text/PageTitle";
import styles from "@/components/menu/admin/Tables.module.css";
import { useState } from "react";
import {Order} from "@/types";
import { handleCancelOrder, handleStatusChange } from "@/components/menu/admin/OrderUtils";
import { NotificationBar } from "./notification";

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
    const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
    const [darken, setDarken] = useState(false);

    const handleClickFetch = (tableNumber: number) => {
        setSelectedTableId(tableNumber);
        setIsSidebarOpen(true);
        setDarken(!darken);
    };

    const handleCloseSidebar = () => {
        setIsSidebarOpen(false);
    };

    const [orders, setOrders] = useState<Order[]>([]);

    {/* Fetch order information */}
    {/* customer_id, customer_full_name, table_number, status, time_ordered, order_id, is_paid, staff_id, waiter_full_name */}
    async function fetchItems(): Promise<Order[]> {
        const response = await fetch('/api/fetch_table_waiter_order');
        const data = await response.json();

        const orders: Order[] = data.map((item: any) => ({
            customer_id: item.customer_id,
            customer_full_name: item.customer_full_name,
            table_number: item.table_number,
            status: item.status,
            time_ordered: item.time_ordered,
            order_id: item.order_id,
            is_paid: item.is_paid ? 'Paid' : 'Not Paid',
            staff_id: item.staff_id,
            waiter_full_name: item.waiter_full_name,
        }));

        setOrders(orders);
        return orders;
    }

    /**
     * Present the list of tables.
     */
    return (

        <>
            <PageHeader>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"></link>  
                <PageTitle>
                    TABLES
                </PageTitle>
            <NotificationBar/>

            </PageHeader>


            {isSidebarOpen && <div className={styles.overlay}></div>}

            {/* Display clickable table number tiles. Fetch and display order information on click.*/}
            <div className="grid grid-cols-3 gap-4">
                {[...Array(9)].map((_, index) => (
                    <div
                        key={index}
                        className={styles.tableItem}
                        onClick={() => {
                            handleClickFetch(index + 1);
                            fetchItems()
                                .then((data) => setOrders(data))
                                .catch((error) => console.error(error));
                        }}
                    >
                        {index + 1}
                </div>
                ))}
            </div>

            {/* Open a sidebar to display table order information */}
            {isSidebarOpen && (
                <div className={styles.sidebar}>
                    <button className={styles.close} onClick={handleCloseSidebar}>&#10006;</button>
                    <div className={styles.sidebarContent}>
                        <div className="mt-4">
                            <p className={styles.tableNumber}>Table {selectedTableId}</p>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>ORDER</th>
                                        <th>STATUS</th>
                                        <th>PAID</th>
                                        <th>TIME</th>
                                        <th>WAITER</th>
                                        <th>CONFIRM</th>
                                        <th>CANCEL</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Filter by selected table number */}
                                    {orders && orders
                                        .filter(order => order.table_number === selectedTableId)
                                        .map(order => (
                                            <tr key={order.customer_id}>
                                                <td>{order.order_id}</td>
                                                <td>
                                                    {order.status === 'Unconfirmed' && (
                                                        <i className="fas fa-clock" title="Unconfirmed"></i>
                                                    )}
                                                    {order.status === 'Confirmed' && (
                                                        <i className="fa-solid fa-check" title="Confirmed"></i>
                                                    )}
                                                </td>
                                                <td>{order.is_paid}</td>
                                                <td>{new Date(order.time_ordered).toLocaleTimeString('en-UK', {hour: '2-digit', minute: '2-digit'})}</td>
                                                <td>{order.waiter_full_name}</td>
                                                <td>
                                                    {order.status === 'Unconfirmed' && (
                                                        <button className={styles.confirm} onClick={() => {
                                                            handleStatusChange(order.order_id, order.status);
                                                            fetchItems();
                                                        }}>
                                                            <i className="fa-solid fa-check"></i></button>
                                                    )}
                                                    {order.status !== 'Unconfirmed' && (
                                                        <i className= "fa-solid fa-check" title="Confirmed"></i>
                                                    )}
                                                </td>
                                                <td>
                                                    <button className={styles.cancel} onClick={() => {
                                                        if (confirm("Are you sure you want to cancel this order?")) {
                                                            handleCancelOrder(order.order_id);
                                                            fetchItems();
                                                        }
                                                    }}><i className= "fa-solid fa-xmark" title="Cancel"></i></button>
                                                    
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