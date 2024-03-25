import {Notification} from "@/types";

export interface ApiAddOrderResponse {
    message: string
    new_order_id: number
}

export interface ApiFetchUnseenNotifications {
    message: string,
    data: {
        notifications: Notification[]
    }
}