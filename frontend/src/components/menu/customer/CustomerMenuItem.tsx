import Link from "next/link";

interface Props {
    name: string
    description: string
    price: string
    calories: number
    image: string
    menuitem_id: number
    type: string
}



export function CustomerMenuItem(props: Props) {
    return (
        <Link href={`/menu/view/${props.menuitem_id}`} className={"rounded-xl bg-white shadow overflow-hidden transition-all duration-100 hover:scale-105"}>
            <div className={"bg-gray-100"} style={{
                height: 200,
                background: `url(${props.image})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat"
            }}/>

            <div className={"p-5 text-left"}>
                <div className={"font-bold text-lg text-wahaca-navy"}>{props.name}</div>
                <div className={"text-wahaca-light-navy text-sm"}>{props.description}</div>
                <div className={"flex justify-start gap-2 mt-3 text-xs text-wahaca-teal"}>
                    <span className={"text-wahaca-blue font-bold"}>£{props.price}</span> | <span>{props.calories} Cal</span>
                </div>
            </div>
        </Link>

    );
}

