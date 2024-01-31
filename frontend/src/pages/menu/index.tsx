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
			<style jsx>{`
					.burger_pos {
						position:static;
					}
					.fish_pos {
						position:relative;
						bottom: 290px;
						left: 600px;
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
            
          <style jsx>{`
              .burger {
								position: relative;
								left: 230px;
								bottom: 260px;
								font-weight: bold;
								font-size: 20px;
              }
							.burger_desc {
								position: relative;
								left: 130px;
								bottom: 260px;
								font-size: 15px;
								font-style: italic;
							}
							.fish {
								position: relative;
								left: 800px;
								bottom: 310px;
								font-weight: bold;
								font-size: 20px;
							}
							.fish_desc {
								position: relative;
								left: 730px;
								bottom: 310px;
								font-size: 15px;
								font-style: italic;
							}
          `}</style>
      </div>
		</section>
	 );
}

 