import React, {Dispatch, SetStateAction} from "react";
import {Notification} from "@/types";

interface Props {
    data: Notification
    setNotifications: Dispatch<SetStateAction<Notification[]>>
}

export function NotificationItem(props: Props) {

    const time = new Date(props.data.time_sent).toLocaleTimeString('en-UK', {
                hour: '2-digit',
                minute: '2-digit',
    });

    function hideNotification() {
        props.setNotifications((old) => (
            old.filter(i => (
                i.id != props.data.id
            ))
        ));
    }

    async function markNotificationAsSeen() {
        try {
            const res = await fetch(`/api/notifications/mark/${props.data.id}`);

            // Success
            if (res.status === 200) {
                hideNotification();

            // Notification id not found
            } else if (res.status === 404) {
                alert("Notification not found");
                hideNotification();

            // Something went wrong
            } else {
                alert("Something went wrong");
            }

        } catch (e) {
            alert("Something went wrong");
        }
    }

    return (
        <div className="flex justify-between items-center">
            <span>
                <div className={"font-medium"}>{props.data.message}</div>
                <div className={"text-xs text-wahaca-light-navy"}>{time}</div>
            </span>
            <button onClick={markNotificationAsSeen}
                    className={"m-0"}>
                Seen
            </button>
        </div>
    )
}