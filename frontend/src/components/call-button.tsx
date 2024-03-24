import React from "react";

export function CallWaiterButton(){
    const handleCallWaiter = async () => {
        // Define the notification details
        const notification = {
            staff_id: 1, 
            message: 'Table 1 is calling', 
            time_sent: new Date().toUTCString(), 
        };

        // Try sending the notification to the backend
        try {
            const response = await fetch('http://127.0.0.1:5000/api/addnotification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(notification),
                mode: 'no-cors'
            });

            // Convert the response to JSON
            const responseData = await response.json();

            // Alert the user that the waiter has been called
            if (response.ok) {
                alert("The waiter has been called!");
            } else {
                throw new Error(responseData.message || "An error occurred");
            }
        } catch (error) {
            // Log the error and inform the user
            console.error(error);
            alert("Failed to call the waiter. Please try again.");
        }
    };

    return (
        <button
            className="bg-wahaca-blue hover:bg-wahaca-teal text-white font-bold py-2 px-4 rounded-lg transition-colors ease-in-out mr-4"
            onClick={handleCallWaiter}
        >
            Call Waiter
        </button>
    );
}
