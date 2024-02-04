import styles from "./items.module.css";

function Menu() { 
	return (
		<div>
			<div className = {styles.fish_pos}>
				<img 
						src="https://i.postimg.cc/L58RR1Lt/fish-and-chips-with-ai-generated-free-png.webp"
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
			<h1> Seafood</h1>
			<Menu />
			<div>
					<div className={"panel"}>
						<form action = "/menu/">
            	<button className={styles.back}>
							back
							</button>
						</form>
					</div>
					<div className={styles.seafood}>
						<p>Fish & Chips</p>
					</div>
					<div className={styles.seafood_desc}>
						<p>Classic Fish & Chips with Tartar sauce</p>
					</div>
					<div className={styles.seafood_price}>
						<p>Price: £11.00</p>
					</div>
					<div className={styles.seafood_calories}>
						<p>Calories: 550 Cal</p>
					</div>
		 </div>
	 </section>
	);
}
