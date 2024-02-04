import styles from "./items.module.css";

function Menu() { 
	return (
			<img 
					src="https://i.postimg.cc/rFM2sQfq/360-F-585291338-0-J8-Q8v-Yb-KDCu8yqqw-AO8-Ps-QZ4-ESP2zd8.jpg"
					alt="Menu picture"
			/>
	);
}

export default function View_Menu(){


	return (
		<section>
			<h1> Burgers</h1>
			<Menu />
			<div>
					<div className={"panel"}>
						<form action = "/menu/">
            	<button className={styles.back}>
							back
							</button>
						</form>
					</div>
					<div className={styles.burger}>
						<p>Cheeseburger</p>
					</div>
					<div className={styles.burger_desc}>
						<p>Our classic cheese burger with various toppings</p>
					</div>
					<div className={styles.burger_price}>
						<p>Price: £8.50</p>
					</div>
					<div className={styles.burger_calories}>
						<p>Calories: 800 Cal</p>
					</div>					
		 </div>
	 </section>
	);
}
