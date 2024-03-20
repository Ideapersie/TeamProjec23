import PageHeader from "@/components/common/text/PageHeader";
import PageTitle from "@/components/common/text/PageTitle";
import styles from "@/components/menu/admin/Tables.module.css";
import { useEffect, useState } from "react";
import {Order} from "@/types";
import { handleStatusChange } from "@/components/menu/admin/OrderUtils";

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

    // const handleStatusChange = (orderId: number, orderStatus: string) => {
    //     const data = {
    //         order_id: orderId,
    //         status: orderStatus === 'Unconfirmed' ? 'Confirmed' : orderStatus
    //     };

    //     fetch('/api/changeorderstatus', {
    //         method: 'POST',
    //         body: JSON.stringify(data),
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         mode: 'no-cors'
    //     })
    //     .then(response => {
    //         if (response.ok) {
    //             console.log('Order status changed successfully');
    //         } else {
    //             console.error('Error changing order status:', response.statusText);
    //         }
    //     })
    //     .catch(error => {
    //         console.error('Error changing order status:', error);
    //     });
    // }

    const [items, setItems] = useState<OrderWithTable[]>([]);

    interface OrderWithTable extends Order {
        table_number: number;
    }
    
    async function fetchItems(): Promise<OrderWithTable[]> {
        try {
            const responseOrder = await fetch("/api/fetchorders");
            const responseTable = await fetch("/api/getTableOrder");
            const dataOrder: Order[] = await responseOrder.json();
            const dataTable: { order_id: number; table_number: number }[] = await responseTable.json();
    
            {/* Create a map from order_id to table_number for efficient lookup */} 
            const tableMap = new Map(dataTable.map(({ order_id, table_number }) => [order_id, table_number]));
    
            {/* Join order and table information */}
            const ordersWithTable: OrderWithTable[] = dataOrder.map(order => ({
                ...order,
                table_number: tableMap.get(order.order_id) || 0
            }));
    
            return ordersWithTable;
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

            {isSidebarOpen && <div className={styles.overlay}></div>}

            <div className="grid grid-cols-3 gap-4">
                {[...Array(9)].map((_, index) => (
                    <div
                        key={index}
                        className={styles.tableItem}
                        onClick={() => handleClickFetch(index + 1)}
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
                            <p className={styles.tableNumber}>Table {selectedTableId}</p>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>ORDER</th>
                                        <th>STATUS</th>
                                        <th>TIME</th>
                                        <th>WAITER</th>
                                        <th>EDIT</th>
                                        <th>CONFIRM</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Filter by selected table number */}
                                    {items && items
                                        .filter(order => order.table_number === selectedTableId)
                                        .map(order => (
                                            <tr key={order.customer_id}>
                                                <td>{order.order_id}</td>
                                                <td>
                                                    {order.status === 'Unconfirmed' && (
                                                        <i className="fas fa-clock"></i>
                                                    )}
                                                    {order.status !== 'Unconfirmed' && (
                                                        <i className= "fas fa-check"></i>
                                                    )}
                                                </td>
                                                <td>{new Date(order.time_ordered).toLocaleTimeString('en-UK', {hour: '2-digit', minute: '2-digit'})}</td>
                                                <td>name</td>
                                                <td>
                                                    <button>
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                </td>
                                                <td>
                                                    {order.status === 'Unconfirmed' && (
                                                        <button className={styles.confirm} onClick={() => handleStatusChange(order.order_id, order.status)}><i className="fas fa-check"></i></button>
                                                    )}
                                                    {order.status !== 'Unconfirmed' && (
                                                        <i className= "fas fa-check"></i>
                                                    )}
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