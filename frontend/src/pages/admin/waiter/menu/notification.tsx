import React, { useEffect, useState } from "react";
import { Notification } from "@/types";

export function NotificationBar() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);


    const fetchNotifications = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/fetchunseennotifications`);
            const data = await response.json();
            if (data && data.length > 0) {
                setNotifications(data);
            }
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        }
    };

    useEffect(() => {
        const interval = setInterval(fetchNotifications, 5000); // Fetch new notifications every 5 seconds

        return () => clearInterval(interval); // Clean up the interval on component unmount
    }, []);

    return (
        <div style={{ position: 'fixed', top: '20px', right: '200px', zIndex: '1000' }}>
            <button onClick={() => setIsOpen(!isOpen)}>Notifications</button>
            {isOpen && (
                <div className="dropdownContent">
                    {notifications.length > 0 ? notifications.map((notification, index) => (
                        <p key={index}>
                        Staff ID: {notification.staff_id}, Message: {notification.message}, Time: {new Date(notification.time_sent).toLocaleTimeString()}
                        </p>
                    )) : <p>No new notifications.</p>}
                </div>
            )}
            <style jsx>{`
                .dropdownContent {
                    position: absolute;
                    background-color: #f9f9f9;
                    min-width: 160px;
                    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
                    padding: 12px 16px;
                    z-index: 1;
                }
            `}</style>
        </div>
    )
}