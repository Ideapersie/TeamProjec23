import React, { useEffect, useState } from "react";
import { Notification } from "@/types";
import {ApiFetchUnseenNotifications} from "@/api.types";

export function NotiButton() {

	const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);

	useEffect(() => {
        void fetchNotifications(); // Fetch notifications when the component mounts
        const interval = setInterval(fetchNotifications, 5000); // Continuously fetch new notifications every 5 seconds
        return () => clearInterval(interval); // Clean up the interval when the component unmounts
    }, []);

	async function fetchNotifications() {
		try {
			const response = await fetch('/api/fetchunseennotifications');

			if (response.status === 200) {
				const data = await response.json() as ApiFetchUnseenNotifications;
				setNotifications(data.data.notifications)
			} else {
				alert("Something went wrong");
			}

		} catch (error) {
			console.error("Failed to fetch notifications:", error);
		}
	}

    return (
		<section className="absolute right-20 top-10 mt-10 mr-40">
			<div onClick={() => setIsOpen(!isOpen)} className="flex items-right relative  hover:scale-110">
				<svg xmlns="http://www.w3.org/2000/svg"
					height={"2.5rem"}
					className={"fill-wahaca-teal"}
					viewBox="0 0 448 512">
					{/*!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.*/}
					<path
						d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v25.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm0 96c61.9 0 112 50.1 112 112v25.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V208c0-61.9 50.1-112 112-112zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z"/>
				</svg>

				<span className="absolute mt-8 text-xs bg-wahaca-pink rounded-full text-white font-bold px-1 py-0.5 left-10">
					{notifications.length}
				</span>
			</div>
			{isOpen && (
				<div style={{ position: 'absolute', backgroundColor: '#f9f9f9', minWidth: '160px', boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)', padding: '12px 16px', zIndex: '1' }}>
					{notifications.length > 0 ? notifications.map((notification, index) => (
						<p key={index}>
						Message: {notification.message}, Time: {new Date(notification.time_sent).toLocaleTimeString('en-UK', {hour: '2-digit', minute: '2-digit'})}
						</p>
					)) : <p>No new notifications.</p>}
				</div>
			)}
		</section>
		)
}	

            
				