import {GridIndex} from "./grid_submenu";
import MockData from "../../mockdata/menu-data.json";
import styles from "./grid_submenu.module.css";

interface Props {
    data: typeof MockData
}

export default function View_Menu(props: Props) {
    return (
        <section>
			<div>
			<form action = "/menu/">
            	<button className={styles.back}>
					back
				</button>
			</form>
			</div>
            <h1> Sides </h1>
            <div className={"grid grid-cols-3 gap-5"}>
                {props.data
					.filter(item => item.type === "Sides")
					.map(item => (
                    	<GridIndex
                        	image_url={item.src}
                        	name={item.name}
                        	description={item.description}
                        	price={item.price}
                        	calories={item.calories}
                    	/>
                ))}
            </div>
        </section>
    );
}

// Importing data on the server and sending it to the react component above
export async function getServerSideProps(): Promise<{props: Props}> {

    // TODO: Replace mock data with a call to the backend server here
    const response = await fetch("http://127.0.0.1:5000/api/menuitems");
    const data = await response.json();

    // ...and passes it to the ViewMenuPage component via props
    return {
        props: {
            data: data
        }
    };
}