export const handleStatusChange = (orderId: number, orderStatus: string) => {
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