import styles from "./items.module.css";

function Menu() { 
	return (
		<div>
			<div className = {styles.cake_pos}>
				<img 
						src="https://i.postimg.cc/0QWCxYbK/chocolate-cake-slice-white-background-720722-8497.jpg"
						alt="Menu picture"
						width = "300"
						height = "300"
				/>
			</div>
		</div>
	);
}

export default function View_Menu(){


	return (
		<section>
			<h1> Desserts</h1>
			<Menu />
			<div>
					<div className={"panel"}>
						<form action = "/menu/">
            	<button className={styles.back}>
							back
							</button>
						</form>
					</div>
					<div className={styles.dessert}>
						<p>Chocolate Cake</p>
					</div>
					<div className={styles.dessert_desc}>
						<p>Homemade chocolate cake</p>
					</div>
					<div className={styles.dessert_price}>
						<p>Price: £7.00</p>
					</div>
					<div className={styles.dessert_calories}>
						<p>Calories: 400 Cal</p>
					</div>
		 </div>
	 </section>
	);
}
