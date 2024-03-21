export type MenuItem = {
    calories: number,
    description: string,
    menuitem_id: number,
    name: string,
    price: string,
    type: string,
    image: string,
    link: string,
    spice: number
}

export type Ingredient = {
    name: string
    allergen: string | null
}

export type MenuItemRelatedIngredients = MenuItem & {
    ingredients: Ingredient[],
    related: MenuItem[]
}

export type Order = {
    customer_id: number,
    customer_full_name: string,
    table_number: number,
    status: string,
    time_ordered: string,
    order_id: number,
    is_paid: string,
    staff_id: number,
    waiter_full_name: string,   
}

/**
 * Represents a CartItem in the browser, where the key is the menuitem_id, and the value is its quantity.
 */
export type BrowserCartObject = {[menuitem_id: string]: number}