export interface ApiAddOrderResponse {
    message: string
    new_order_id: number
}

export interface ApiGetOrderByIdResponse {
    message: string
    data: {
        order: {
            customer: {
                email: string
                first_name: string
                id: number
                last_name: string
                table_number: 1
            }
            id: number
            is_paid: boolean
            status: string
            time_ordered: string
            ordered_items: {
                menuitem_id: number,
                quantity: number,
                name: string,
                description: string,
                type: string,
                price: number,
                subtotal: number,
                image: string
            }[]
        }
    }
}