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
        <Link href={`/menu/view/${props.menuitem_id}`} className={"rounded-xl bg-white shadow px-10 py-5"}>
            <div>
                <div className={"mb-3"} style={{
                    height: 200,
                    background: `url(${props.image})`,
                    backgroundPosition: "center",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat"
                }}/>
                <div className={styles.name}>{props.name}</div>
                <div className={styles.description}>{props.description}</div>
                <div className={styles.price}>£{props.price}</div>
                <div className={styles.calories}>{props.calories} Cal</div>
            </div>
        </Link>
            
    );
}

