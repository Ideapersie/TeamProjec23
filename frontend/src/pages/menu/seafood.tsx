
function Menu() { 
	return (
		<div>
			<div className ="fish_pos">
				<img 
						src="https://i.postimg.cc/L58RR1Lt/fish-and-chips-with-ai-generated-free-png.webp"
						alt="Menu picture"
						width = "500"
						height = "500"
				/>
				<style jsx>{`
						.fish_pos {
							position:relative;
							bottom: 0px;
							left: 70px;
						}
				`}</style>
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
            	<button className={"back"}>
							back
							</button>
						</form>
					</div>
					<div className={"fish"}>
						<p>Fish & Chips</p>
					</div>
					<div className={"fish_desc"}>
						<p>Classic Fish & Chips with Tartar sauce</p>
					</div>
					<div className={"price"}>
						<p>Price: £11.00</p>
					</div>
					<div className={"calories"}>
						<p>Calories: 550 Cal</p>
					</div>
					 
				 <style jsx>{`
						 .fish {
							position:relative;
							left: 260px;
							top: 20px;
							font-weight: bold;
							font-size: 20px;
						 }
						 .fish_desc {
							position:relative;
							left: 180px;
							top: 20px;
							font-size: 15px;
							font-style: italic;
						 }
						 .price	{
							position:relative;
							left: 270px;
							top: 30px;
							font-size: 14px;
							font-weight: bold;
							font-style: italic;
						 }
						 .calories	{
							position:relative;
							left: 260px;
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
