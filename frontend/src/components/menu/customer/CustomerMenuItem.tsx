import { useState } from "react";
import styles from "./CustomerMenuItem.module.css";
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
        <Link href={`/menu/view/${props.menuitem_id}`} className={"rounded-none bg-white"}>

            <div className={"relative"}>
            <div
                className={"mb-3 cursor-pointer"}
                style={{
                    height: 400,
                    background: `url(${props.image})`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat"
                }}
            />
            <div className={styles.name}>{props.name}</div>
            <div className={styles.description}>{props.description}</div>
            <div className={styles.price}>£{props.price}</div>
            <div className={styles.calories}>{props.calories} kcal</div>
        </div>
        </Link>
            
    );
}

