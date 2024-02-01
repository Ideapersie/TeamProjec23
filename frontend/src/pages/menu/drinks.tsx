
function Menu() { 
	return (
		<div>
			<div className ="coke_pos">
				<img 
						src="https://i.postimg.cc/7hDMGxtt/coke1.png"
						alt="Menu picture"
						width = "500"
						height = "500"
				/>
				<style jsx>{`
						.coke_pos {
							position:relative;
							bottom: 0px;
							left: 0px;
						}
				`}</style>
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
            	<button className={"back"}>
							back
							</button>
						</form>
					</div>
					<div className={"drink"}>
						<p>Coke Original</p>
					</div>
					<div className={"drink_desc"}>
						<p>Coca Cola's Original recipe</p>
					</div>
					<div className={"price"}>
						<p>Price: £2.50</p>
					</div>
					<div className={"calories"}>
						<p>Calories: 50 Cal</p>
					</div>
					 
				 <style jsx>{`
						 .drink {
							position:relative;
							left: 185px;
							top: 20px;
							font-weight: bold;
							font-size: 20px;
						 }
						 .drink_desc {
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
							left: 195px;
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
