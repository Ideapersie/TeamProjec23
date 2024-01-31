
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
							position:relative;
							left: 260px;
							bottom: 10px;
							font-weight: bold;
							font-size: 20px;
						 }
						 .description {
							position:relative;
							left: 150px;
							bottom: 10px;
							font-size: 15px;
							font-style: italic;
						 }
						 .price	{
							position:relative;
							left: 280px;
							font-size: 14px;
							font-weight: bold;
							font-style: italic;
						 }
						 .calories	{
							position:relative;
							left: 270px;
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
