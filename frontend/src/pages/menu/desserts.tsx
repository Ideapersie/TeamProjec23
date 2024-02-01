
function Menu() { 
	return (
		<div>
			<div className ="cake_pos">
				<img 
						src="https://i.postimg.cc/0QWCxYbK/chocolate-cake-slice-white-background-720722-8497.jpg"
						alt="Menu picture"
						width = "300"
						height = "300"
				/>
				<style jsx>{`
						.cake_pos {
							position:relative;
							bottom: 0px;
							left: 100px;
						}
				`}</style>
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
            	<button className={"back"}>
							back
							</button>
						</form>
					</div>
					<div className={"dessert"}>
						<p>Chocolate Cake</p>
					</div>
					<div className={"dessert_desc"}>
						<p>Homemade chocolate cake</p>
					</div>
					<div className={"price"}>
						<p>Price: £7.00</p>
					</div>
					<div className={"calories"}>
						<p>Calories: 400 Cal</p>
					</div>
					 
				 <style jsx>{`
						 .dessert {
							position:relative;
							left: 185px;
							top: 20px;
							font-weight: bold;
							font-size: 20px;
						 }
						 .dessert_desc {
							position:relative;
							left: 160px;
							top: 20px;
							font-size: 15px;
							font-style: italic;
						 }
						 .price	{
							position:relative;
							left: 210px;
							top: 30px;
							font-size: 14px;
							font-weight: bold;
							font-style: italic;
						 }
						 .calories	{
							position:relative;
							left: 200px;
							top: 30px;
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
