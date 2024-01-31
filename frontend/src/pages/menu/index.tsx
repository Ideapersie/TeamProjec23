import Link from "next/link";

function Menu() { 
	return (
		<Link href = "/menu/burger/">
			<img 
					src="https://i.postimg.cc/rFM2sQfq/360-F-585291338-0-J8-Q8v-Yb-KDCu8yqqw-AO8-Ps-QZ4-ESP2zd8.jpg"
					alt="Menu picture"
					width="600" 
					height="600" 
					//style = 5px solid black"
			/>
		</Link>
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
					<div className={"description"}>
						<p>Our classic cheese burger with various toppings</p>
          </div>
            
          <style jsx>{`
              .burger {
									font-weight: bold;
									font-size: 20px;
                  background: white;
                  padding: 20px 0px 10px 240px;
                  border-radius: 10px;
									border-colour: black;
              }
							.description {
									padding: 0px 0px 10px 130px;
									font-size: 15px;
									font-style: italic;

							}
          `}</style>
      </div>
		</section>
	 );
}

 