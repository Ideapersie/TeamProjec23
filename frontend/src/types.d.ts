export type MenuItem = {
    map(arg0: (item: any) => import("react").JSX.Element): import("react").ReactNode
    calories: number,
    description: string,
    menuitem_id: number,
    name: string,
    price: string,
    type: string,
    image: string,
    link: string
}