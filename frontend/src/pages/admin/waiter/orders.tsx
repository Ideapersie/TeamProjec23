import PageHeader from "@/components/common/text/PageHeader";
import PageTitle from "@/components/common/text/PageTitle";
import PageSubtitle from "@/components/common/text/PageSubtitle";
import { useEffect, useState } from "react";

/**
 * View Customer orders.
 * 
 * @returns A list of customer orders
 * @author Madeleine Huebner (Madeleine.Huebner.2022@live.rhul.ac.uk)
 */

export default function ViewCustomerOrdersPage() {

    /**
     * Manage the state of the elements.
     */
    const [orders, setOrders] = useState(null);

    /**
     * Fetch order data from Flask API route.
     */
    useEffect(() => {
        fetch("http://127.0.0.1:5000/api/fetchOrders")
        .then(response => response.json())
        .then(data => setOrders(data))
        .catch(error => console.error(error));
    }, []);

    /**
     * Present the list of customer orders.
     * 
     * TODO: list cutomer orders and sort by timestamps.
     */
    return (
        <>
            <PageHeader>
                <PageTitle>
                    Customer Orders
                </PageTitle>
                <PageSubtitle>
                    View and confirm customer orders.
                </PageSubtitle>
            </PageHeader>

        </>
    )
}