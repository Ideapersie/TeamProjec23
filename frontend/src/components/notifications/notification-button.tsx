import React, {useEffect, useState} from "react";
import {Notification} from "@/types";
import {ApiFetchUnseenNotifications} from "@/api.types";
import {NotificationItem} from "@/components/notifications/notification-item";

export function NotificationButton() {

    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [oldNotifications, setOldNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;

        fetchNotifications()
            .then(loop => {
                if (loop) {
                    interval = setInterval(fetchNotifications, 5000) // Continuously fetch new notifications every 5 seconds
                }
            })

        return () => interval && clearInterval(interval); // Clean up the interval when the component unmounts
    }, []);

    async function fetchNotifications(): Promise<boolean> {
        try {
            const response = await fetch('/api/fetchunseennotifications');

            if (response.status === 200) {
                const data = await response.json() as ApiFetchUnseenNotifications;
                setNotifications(data.data.notifications);
                return true;

            } else if (response.status === 403) {
                console.log("Notification feature not available to customers");

            } else {
                alert("Something went wrong");
            }

            return false;

        } catch (error) {
            console.error("Failed to fetch notifications:", error);
            return false;
        }
    }

    // New useEffect hook for playing sound and updating oldNotifications
    useEffect(() => {
        const currentNotificationsString = JSON.stringify(notifications);
        const oldNotificationsString = JSON.stringify(oldNotifications);

        if (currentNotificationsString !== oldNotificationsString) {
            // Play sound only if there are new notifications.
            if (notifications.length > oldNotifications.length) {
                new Audio("/audio/notification.wav").play();
            }
            // Update oldNotifications to match the current state.
            setOldNotifications(notifications);
        }
    }, [notifications]); // Only re-run the effect if notifications change.

    return (
        <section className={"select-none"}>
            <div onClick={() => setIsOpen(!isOpen)}
                 className="flex items-right relative hover:scale-110"
                 role={"button"}
            >
                <svg xmlns="http://www.w3.org/2000/svg"
                     height={"2rem"}
                     className={"fill-wahaca-teal"}
                     viewBox="0 0 448 512">
                    {/*!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.*/}
                    <path
                        d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v25.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm0 96c61.9 0 112 50.1 112 112v25.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V208c0-61.9 50.1-112 112-112zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z"/>
                </svg>

                {notifications.length > 0 &&
                    <span className={`absolute text-xs bg-wahaca-pink rounded-full text-white font-bold flex
									items-center justify-center h-4 w-4 -bottom-1.5 -right-2`}>
						{notifications.length}
					</span>
                }
            </div>
            {isOpen && (
                <div className={"absolute right-0 bottom-100 mt-5 w-screen max-w-lg bg-white p-8 shadow rounded-xl"}>
                    <div className={"flex flex-col gap-3"}>
                        {notifications.length > 0 ? notifications.map((notification, index) => (
                            <>
                                {index != 0 &&
                                    <hr/>
                                }

                                <NotificationItem
                                    key={notification.id}
                                    data={notification}
                                    setNotifications={setNotifications}
                                />
                            </>
                        )) : <p>No new notifications.</p>}
                    </div>
                </div>
            )}
        </section>
    )
}	

            
				