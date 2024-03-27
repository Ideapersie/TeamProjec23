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
                <div className={"flex justify-start items-center gap-2 mt-3 text-xs text-wahaca-teal"}>
                    <span className={"text-wahaca-blue font-bold"}>£{props.data.price}</span>
                    |
                    <span>{props.data.calories} cals</span>
                    {props.data.spice !== 0 &&
                        <>
                            |
                            <span className={`flex gap-0.5 ${props.data.spice === 3 ? "fill-wahaca-pink" : props.data.spice === 2 ? "fill-amber-500" : "fill-lime-500"}`}>
                                {Array(props.data.spice).fill(null).map((value, index) => (
                                    <svg key={index} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height={"0.7rem"}>
                                        {/*Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.*/}
                                        <path
                                            d="M428.3 3c11.6-6.4 26.2-2.3 32.6 9.3l4.8 8.7c19.3 34.7 19.8 75.7 3.4 110C495.8 159.6 512 197.9 512 240c0 18.5-3.1 36.3-8.9 52.8c-6.1 17.3-28.5 16.3-36.8-.1l-11.7-23.4c-4.1-8.1-12.4-13.3-21.5-13.3H360c-13.3 0-24-10.7-24-24V152c0-13.3-10.7-24-24-24l-17.1 0c-21.3 0-30-23.9-10.8-32.9C304.7 85.4 327.7 80 352 80c28.3 0 54.8 7.3 77.8 20.2c5.5-18.2 3.7-38.4-6-55.8L419 35.7c-6.4-11.6-2.3-26.2 9.3-32.6zM171.2 345.5L264 160l40 0v80c0 26.5 21.5 48 48 48h76.2l23.9 47.8C372.3 443.9 244.3 512 103.2 512H44.4C19.9 512 0 492.1 0 467.6c0-20.8 14.5-38.8 34.8-43.3l49.8-11.1c37.6-8.4 69.5-33.2 86.7-67.7z"/>
                                    </svg>
                                ))}
                            </span>
                        </>
                    }
                </div>
            </div>
        </Link>

    );
}

