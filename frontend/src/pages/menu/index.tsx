import Link from "next/link";
import styles from "./items.module.css";


function Menu() { 
	return (
		<div>
			<div className = {styles.burger_pos_view}>
				<Link href = "/menu/burger/">
					<img 
						src ="https://i.postimg.cc/rFM2sQfq/360-F-585291338-0-J8-Q8v-Yb-KDCu8yqqw-AO8-Ps-QZ4-ESP2zd8.jpg"
						alt ="Burger Image"
						width ="600" 
						height ="600" 
						//style = 5px solid black"
					/>
				</Link>
			</div>
			<div className = {styles.fish_pos_view}>
				<Link href = "/menu/seafood/">
					<img
						src ="https://i.postimg.cc/L58RR1Lt/fish-and-chips-with-ai-generated-free-png.webp"
						alt = "Fish & Chips Image"
						width = "500"
						height = "500"

					/>
				</Link>
			</div>
			<div className = {styles.coke_pos_view}>
				<Link href = "/menu/drinks/">
					<img
						src ="https://i.postimg.cc/7hDMGxtt/coke1.png"
						alt = "Drink Image"
						width = "500"
						height = "500"

					/>
				</Link>
			</div>
			<div className = {styles.cake_pos_view}>
				<Link href = "/menu/desserts/">
					<img
						src ="https://i.postimg.cc/0QWCxYbK/chocolate-cake-slice-white-background-720722-8497.jpg"
						alt = "Cake Image"
						width = "300"
						height = "300"

					/>
				</Link>
			</div>
		</div>
	);
}


 
export default function View_Menu(){

	 return (
		 <section>
			 <h1> Menu</h1>
			 <Menu />
			 <div>
          <div className={styles.burger_title_view}>
            <p>Cheeseburger</p>
					</div>
					<div className={styles.burger_desc_view}>
						<p>Our classic cheese burger with various toppings</p>
          </div>
					<div className={styles.fish_title_view}>
            <p>Fish & Chips</p>
					</div>
					<div className={styles.fish_desc_view}>
            <p>Classic Fish & Chips with Tartar sauce</p>
					</div>
					<div className={styles.coke_title_view}>
            <p>Coke Original</p>
					</div>
					<div className={styles.coke_desc_view}>
            <p>Coca Cola's Original recipe</p>
					</div>
					<div className={styles.cake_title_view}>
            <p>Chocolate Cake</p>
					</div>
					<div className={styles.cake_desc_view}>
            <p>Homemade chocolate cake</p>
					</div>
      </div>
		</section>
	 );
}

 