import Link from "next/link";

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
            	<button className={"back"}>
							back
							</button>
						</form>
					</div>
					<div className={"burger"}>
						<p>Cheeseburger</p>
					</div>
					<div className={"description"}>
						<p>Our classic cheese burger with various toppings</p>
					</div>
					<div className={"price"}>
						<p>Price: £8.50</p>
					</div>
					<div className={"calories"}>
						<p>Calories: 800 Cal</p>
					</div>
					 
				 <style jsx>{`
						 .burger {
								 font-weight: bold;
								 font-size: 20px;
								 background: white;
								 padding: 20px 0px 10px 270px;
								 border-radius: 10px;
								 border-colour: black;
						 }
						 .description {
								 padding: 0px 0px 10px 170px;
								 font-size: 15px;
								 font-style: italic;
						 }
						 .price	{
								padding: 0px 0px 10px 290px;
								font-size: 14px;
								font-style: italic;
						 }
						 .calories	{
							padding: 0px 0px 10px 270px;
							font-size: 14px;
							font-style: italic;
					 	 }
						 .back	{
							position:fixed;
							bottom:0;

						 }
				 `}</style>
		 </div>
	 </section>
	);
}
