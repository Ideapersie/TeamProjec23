import React, { useEffect, useState } from "react";
import { Notification } from "@/types";
import { NotiButton } from "@/components/noti-button";

export function NotificationBar() {
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
            <NotiButton/>
        </div>
    )
}