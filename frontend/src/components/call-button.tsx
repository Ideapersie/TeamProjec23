import {useEffect, useState} from "react";

/**
 * Renders a button for a customer to summon a waiter.
 *
 * @constructor
 * @author Alvis Wang (zkac380@live.rhul.ac.uk)
 */
export function CallWaiterButton(){

    const [waiterCalled, setWaiterCalled] = useState<boolean>(false);

    useEffect(() => {
        if (waiterCalled) {
            // Re-enables ability to call waiter after 5 seconds
            setTimeout(() => {
                setWaiterCalled(false);
            }, 5000);
        }
    }, [waiterCalled]);

    async function handleCallWaiter() {

        // Define the notification payload
        const payload = {
            staff_id: 1,
            message: 'Table 1 is calling'
        };

        // Try sending the notification to the backend
        try {
            const response = await fetch('/api/addnotification', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            
            // If success, alter the customer that the waiter has been called
            if (response.status === 200) {
                setWaiterCalled(true);

            // Else...
            } else {
                alert("Failed to call the waiter")
            }

        } catch (error) {
            // Log the error and inform the user
            console.error(error);
            alert("Failed to call the waiter. Please try again.");
        }
    }

    return (
        <button
            className="bg-wahaca-blue hover:bg-wahaca-teal text-white text-sm m-0 font-bold py-2 px-4 rounded-lg transition-colors ease-in-out"
            onClick={handleCallWaiter}
            disabled={waiterCalled}
        >
            {waiterCalled ? "Waiter called" : "Call Waiter"}
        </button>
    );
}
