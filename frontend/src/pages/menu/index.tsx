import Link from "next/link";
import burger from "./burger.module.css";
import seafood from "./seafood.module.css";
import drink from "./drink.module.css";
import dessert from "./dessert.module.css";


function Menu() { 
	return (
		<div>
			<div className = {burger.burger_position}>
				<Link href = "/menu/burger/">
					{/* TODO: make into grids therefore don't have to manually move*/}
					<img 
						src ="https://i.postimg.cc/rFM2sQfq/360-F-585291338-0-J8-Q8v-Yb-KDCu8yqqw-AO8-Ps-QZ4-ESP2zd8.jpg"
						alt ="Burger Image"
						width ="600" 
						height ="600" 
					/>
				</Link>
			</div>
			<div className = {seafood.fish_position}>
				<Link href = "/menu/seafood/">
					<img
						src ="https://i.postimg.cc/L58RR1Lt/fish-and-chips-with-ai-generated-free-png.webp"
						alt = "Fish & Chips Image"
						width = "500"
						height = "500"
					/>
				</Link>
			</div>
			<div className = {drink.coke_position}>
				<Link href = "/menu/drinks/">
					<img
						src ="https://i.postimg.cc/7hDMGxtt/coke1.png"
						alt = "Drink Image"
						width = "500"
						height = "500"
					/>
				</Link>
			</div>
			<div className = {dessert.cake_position}>
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
          <div className={burger.burger_title}>
            <p>Cheeseburger</p>
					</div>
					<div className={burger.burger_desc}>
						<p>Our classic cheese burger with various toppings</p>
          </div>
					<div className={seafood.fish_title}>
            <p>Fish & Chips</p>
					</div>
					<div className={seafood.fish_desc}>
            <p>Classic Fish & Chips with Tartar sauce</p>
					</div>
					<div className={drink.coke_title}>
            <p>Coke Original</p>
					</div>
					<div className={drink.coke_desc}>
            <p>Coca Cola's Original recipe</p>
					</div>
					<div className={dessert.cake_title}>
            <p>Chocolate Cake</p>
					</div>
					<div className={dessert.cake_desc}>
            <p>Homemade chocolate cake</p>
					</div>
      </div>
		</section>
	 );
}

 