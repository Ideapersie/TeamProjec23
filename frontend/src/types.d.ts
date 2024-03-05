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

export type Ingredients = {
    name: string
    allergen: string | null
}