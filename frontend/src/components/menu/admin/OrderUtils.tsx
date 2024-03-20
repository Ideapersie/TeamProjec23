/**
 * Send changed order status to API endpoint.
 * 
 * @returns A component sending status update to API endpoint.
 * @author Madeleine Huebner (Madeleine.Huebner.2022@live.rhul.ac.uk)
 */

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