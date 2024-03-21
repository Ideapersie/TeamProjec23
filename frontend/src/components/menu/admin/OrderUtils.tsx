/**
 * Send data over to API endpoints.
 * 
 * @author Madeleine Huebner (Madeleine.Huebner.2022@live.rhul.ac.uk)
 */

{/* Send over modified order status */}
export const handleStatusChange = (orderId: number, orderStatus: string) => {

    {/* Data to send over. Change status to confirmed. */}
    const data = {
        order_id: orderId,
        status: orderStatus === 'Unconfirmed' ? 'Confirmed' : orderStatus
    };

    fetch('/api/changeorderstatus', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'no-cors'
    })
    .then(response => {
        if (response.ok) {
            console.log('Order status changed successfully');
        } else {
            console.error('Error changing order status:', response.statusText);
        }
    })
    .catch(error => {
        console.error('Error changing order status:', error);
    });
}

{/* Request to cancel an order */}
export const handleCancelOrder = (orderId: number) => {
    const data = {
        order_id: orderId,
    };

    fetch('/api/deleteorder', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'no-cors'
    })
    .then(response => {
        if (response.ok) {
            console.log('Order has been successfully deleted.');
        } else {
            console.error('Error deleting order:', response.statusText);
        }
    })
    .catch(error => {
        console.error('Error deleting order:', error);
    });
}