import styles from "./grid_submenu.module.css";

interface Props {
    name: string
    description: string
    price: string
    calories: string
    image: string
}

export function GridIndex(props: Props) {
    return (
        <div>
            <img
                src={props.image}
                alt={`${props.name} image`}
                width="600"
                height="600"
            />
            <div className={styles.name}>{props.name}</div>
            <div className={styles.description}>{props.description}</div>
            <div className={styles.price}>{props.price}</div>
            <div className={styles.calories}>{props.calories}</div>
        </div>
    );
}

