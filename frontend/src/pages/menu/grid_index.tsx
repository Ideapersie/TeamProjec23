import Link from "next/link";
import styles from "./grid_index.module.css";

interface Props {
    link: string
    name: string
    description: string
    price: string
    calories: number
    image: string
}

export function GridIndex(props: Props) {
    return (
        <div>
            <Link href={props.link}>
                <img
                    src={props.image}
                    alt={`${props.name} image`}
                    width="500"
                    height="500"
                />
                <div className={styles.name}>{props.name}</div>
                <div className={styles.description}>{props.description}</div>
                <div className={styles.price}>£{props.price}</div>
                <div className={styles.calories}>{props.calories} Cal</div>
            </Link> 
        </div>
    );
}

