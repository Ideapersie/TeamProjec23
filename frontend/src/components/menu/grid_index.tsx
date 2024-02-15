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
        <div className={"rounded-xl bg-white shadow px-10 py-5"}>
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
        </div>
    );
}

