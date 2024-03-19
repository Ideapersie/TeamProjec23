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