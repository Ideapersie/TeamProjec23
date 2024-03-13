import PageHeader from "@/components/common/text/PageHeader";
import PageTitle from "@/components/common/text/PageTitle";
import PageSubtitle from "@/components/common/text/PageSubtitle";
import {Order} from "@/types";
import { useEffect, useState } from "react";

/**
 * Data to be passed in as props.
 */
interface Props {
    data: Order[]
}

/**
 * Fetch and display customer orders.
 * 
 * @param {Props} props The props object containing the customer order data.
 * @returns {JSX.Element} The list of customer orders.
 * @author Madeleine Huebner (Madeleine.Huebner.2022@live.rhul.ac.uk)
 */
export default function ViewOrdersPage(props: Props): JSX.Element {
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

    return (
        <>
            <PageHeader>
                <PageTitle>
                    View Orders
                </PageTitle>
                <PageSubtitle>
                    View customer orders
                </PageSubtitle>
            </PageHeader>

            <button onClick={() => fetchItems().then((data) => setItems(data)).catch((error) => console.error(error))}>
                Fetch Orders
            </button>

            <ul>
                {items && items.map((order) => (
                    <li key={order.order_id}>
                        Order ID: {order.order_id}, 
                        Customer ID: {order.customer_id}, 
                        Status: {order.status}, 
                        Time Ordered: {order.time_ordered}, 
                        Table Number: {order.table_number}
                    </li>
                ))}
            </ul>

        </>
    )
}