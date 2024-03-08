export type MenuItem = {
    calories: number,
    description: string,
    menuitem_id: number,
    name: string,
    price: string,
    type: string,
    image: string,
    link: string
}

export type Ingredient = {
    name: string
    allergen: string | null
}

export type Order = {
    order_id: number,
    customer_id: number,
    status: string,
    time_ordered: number,
    table_number: number
}

/**
 * Represents a CartItem in the browser, where the key is the menuitem_id, and the value is its quantity.
 */
export type BrowserCartObject = {[menuitem_id: string]: number}