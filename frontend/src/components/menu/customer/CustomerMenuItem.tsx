import Link from "next/link";
import {MenuItem} from "@/types";

interface Props {
    data: MenuItem
}

export function CustomerMenuItem(props: Props) {
    return (
        <Link href={`/menu/view/${props.data.menuitem_id}`} className={"rounded-xl bg-white shadow overflow-hidden transition-all duration-100 hover:scale-105"}>
            <div className={"bg-gray-100"} style={{
                height: 200,
                background: `url(${props.data.image})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat"
            }}/>

            <div className={"p-5 text-left"}>
                <div className={"font-bold text-lg text-wahaca-navy mb-1.5"}>{props.data.name}</div>
                <div className={"text-wahaca-light-navy text-sm"}>{props.data.description}</div>
                <div className={"flex justify-start gap-2 mt-3 text-xs text-wahaca-teal"}>
                    <span className={"text-wahaca-blue font-bold"}>£{props.data.price}</span> | <span>{props.data.calories} Cal</span>
                </div>
            </div>
        </Link>

    );
}

