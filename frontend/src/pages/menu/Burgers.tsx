import styles from "./burger.module.css";
import MockData from "../../mockdata/menu-data.json";

interface Props {
	data: typeof MockData
}

function Menu() { 
	return (
		<div>
			<div className = {styles.burger_pos}>
				<img 
					src="https://i.postimg.cc/rFM2sQfq/360-F-585291338-0-J8-Q8v-Yb-KDCu8yqqw-AO8-Ps-QZ4-ESP2zd8.jpg"
					alt="Menu picture"
				/>
			</div>
			<div>
				<form action = "/menu/">
            		<button className={styles.back}>
						back
					</button>
				</form>
			</div>
			<div className={styles.burger}>
				<p>Cheeseburger</p>
			</div>
			<div className={styles.description}>
				<p>Our classic cheese burger with various toppings</p>
			</div>
			<div className={styles.price}>
				<p>Price: £8.50</p>
			</div>
			<div className={styles.calories}>
				<p>Calories: 800 Cal</p>
			</div>
		</div>
	);
}

export default function View_Menu(){

	return (
		<section>
			<h1> Burgers</h1>
			<Menu/>
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
