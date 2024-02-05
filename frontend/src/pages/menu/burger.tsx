import styles from "./burger.module.css";
import MockData from "../../mockdata/menu-data.json";

interface Props {
	dishes: typeof MockData
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
		</div>
	);
}

export default function View_Menu(props: Props){

	return (
		<section>
			<h1> Burgers</h1>
			<Menu/>
			<div>
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
				{/*Displays each item/dish/drink in the menu*/}			
		 	</div>
	 	</section>
	);
}
