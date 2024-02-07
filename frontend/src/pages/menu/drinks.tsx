import styles from "./drink.module.css";

function Menu() { 
	return (
		<div>
			<div className = {styles.coke_pos}>
				<img 
						src="https://i.postimg.cc/7hDMGxtt/coke1.png"
						alt="Menu picture"
						width = "500"
						height = "500"
				/>
			</div>
		</div>
	);
}

export default function View_Menu(){


	return (
		<section>
			<h1> Drinks</h1>
			<Menu />
			<div>
					<div className={"panel"}>
						<form action = "/menu/">
            	<button className={styles.back}>
							back
							</button>
						</form>
					</div>
					<div className={styles.drink}>
						<p>Coke Original</p>
					</div>
					<div className={styles.desc}>
						<p>Coca Cola's Original recipe</p>
					</div>
					<div className={styles.price}>
						<p>Price: £2.50</p>
					</div>
					<div className={styles.calories}>
						<p>Calories: 50 Cal</p>
					</div>
		 </div>
	 </section>
	);
}
