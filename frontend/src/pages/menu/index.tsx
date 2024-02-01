import Link from "next/link";

function Menu() { 
	return (
		<div>
			<div className = "burger_pos">
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
			<div className = "fish_pos">
				<Link href = "/menu/seafood/">
					<img
						src ="https://i.postimg.cc/L58RR1Lt/fish-and-chips-with-ai-generated-free-png.webp"
						alt = "Fish & Chips Image"
						width = "500"
						height = "500"

					/>
				</Link>
			</div>
			<div className = "drink_pos">
				<Link href = "/menu/drinks/">
					<img
						src ="https://i.postimg.cc/7hDMGxtt/coke1.png"
						alt = "Drink Image"
						width = "500"
						height = "500"

					/>
				</Link>
			</div>
			<div className = "cake_pos">
				<Link href = "/menu/desserts/">
					<img
						src ="https://i.postimg.cc/pLSN2z1D/best-chocolate-cake5.jpg"
						alt = "Cake Image"
						width = "500"
						height = "500"

					/>
				</Link>
			</div>
			<style jsx>{`
					.burger_pos {
						position:static;
					}
					.fish_pos {
						position:relative;
						bottom: 290px;
						left: 600px;
					}
					.drink_pos {
						position:relative;
						bottom: 530px;
						left: 1200px;
					}
					.cake_pos {
						position:relative;
						bottom: 800px;
						left: 1900px;
					}
			`}</style>
		</div>
	);
}


 
export default function View_Menu(){

	 return (
		 <section>
			 <h1> Menu</h1>
			 <Menu />
			 <div>
          <div className={"burger"}>
            <p>Cheeseburger</p>
					</div>
					<div className={"burger_desc"}>
						<p>Our classic cheese burger with various toppings</p>
          </div>
					<div className={"fish"}>
            <p>Fish & Chips</p>
					</div>
					<div className={"fish_desc"}>
            <p>Classic Fish & Chips with Tartar sauce</p>
					</div>
					<div className={"drink"}>
            <p>Coke Original</p>
					</div>
					<div className={"drink_desc"}>
            <p>Coca Cola's Original recipe</p>
					</div>
					<div className={"cake"}>
            <p>Chocolate Cake</p>
					</div>
					<div className={"cake_desc"}>
            <p>Homemade chocolate cake</p>
					</div>
            
          <style jsx>{`
              .burger {
								position: relative;
								left: 230px;
								bottom: 750px;
								font-weight: bold;
								font-size: 20px;
              }
							.burger_desc {
								position: relative;
								left: 130px;
								bottom: 750px;
								font-size: 15px;
								font-style: italic;
							}
							.fish {
								position: relative;
								left: 800px;
								bottom: 800px;
								font-weight: bold;
								font-size: 20px;
							}
							.fish_desc {
								position: relative;
								left: 730px;
								bottom: 800px;
								font-size: 15px;
								font-style: italic;
							}
							.drink {
								position: relative;
								left: 1390px;
								bottom: 850px;
								font-weight: bold;
								font-size: 20px;
							}
							.drink_desc {
								position: relative;
								left: 1360px;
								bottom: 850px;
								font-size: 15px;
								font-style: italic;
							}
							.cake {
								position: relative;
								left: 2050px;
								bottom: 900px;
								font-weight: bold;
								font-size: 20px;
							}
							.cake_desc {
								position: relative;
								left: 2035px;
								bottom: 900px;
								font-size: 15px;
								font-style: italic;
							}
          `}</style>
      </div>
		</section>
	 );
}

 