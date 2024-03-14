import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { Ingredient, MenuItem } from "@/types";
import styles from "./[id].module.css";
import PageHeader from "@/components/common/text/PageHeader";

/**
 * Adds to menu item type to mirror response from api.
 */
type MenuItemWithIngredientsAndRelated = MenuItem & {
	ingredients: Ingredient[];
	related: MenuItem[];
};

/**
 * The props to be passed to our ItemPage page component.
 */
interface PageProps {
	data: MenuItemWithIngredientsAndRelated | null;
}

/**
 * Renders page for viewing a single menu item.
 *
 * @constructor
 * @author Idea Khan (zlac177@live.rhul.ac.uk), Vincent Chapman-Andrews (zlac465@live.rhul.ac.uk)
 */
export default function ItemPage(props: PageProps) {
	const router = useRouter();

	if (props.data === null) {
		return <>Item does not exist</>;
	}

	function handleAddToCart() {
		if (props.data === null) {
			return;
		}

		let cartString = sessionStorage.getItem("Cart");

		if (cartString === null) {
			cartString = "{}";

			sessionStorage.setItem("Cart", JSON.stringify({}));
		}

		const cart = JSON.parse(cartString);
		const id = props.data.menuitem_id;

		if (id in cart) {
			cart[id] += 1;
		} else {
			cart[id] = 1;
		}

		sessionStorage.setItem("Cart", JSON.stringify(cart));
	}

	return (
		<>
			<PageHeader>
				<link
					rel="stylesheet"
					href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
				/>
			</PageHeader>

			<section>

				<div className={"flex justify-between"}>
                    <div>
                        <button className={"bg-wahaca-blue"} onClick={() => router.back()}>
						    Go back
					    </button>
                    </div>
					<button
						className={"bg-transparent absolute top-12 right-14"}
						onClick={() => (window.location.href = "/menu/view/cart")}
					>
						<i className="fas fa-shopping-cart text-wahaca-blue fa-3x"></i>
					</button>
				</div>

				<div className={"flex-col mt-5"}>
					<div className={"flex"}>
						<div style={{ height: 500, width: 500}}>
							<div
								style={{
									height: 400,
									width: 400,
									background: `url(${props.data.image})`,
									backgroundPosition: "center",
									backgroundSize: "cover",
									backgroundRepeat: "no-repeat",
								}}
							/>
						</div>
						{/* Flex column to contain item info */}
						<div className={"flex flex-col gap-5"}>
							<div className={styles.name}>{props.data.name}</div>
							<div className={styles.description}>{props.data.description}</div>
							<div className={styles.price}>£{parseFloat(props.data.price).toFixed(2)}</div>
							<div className={styles.calories}>{props.data.calories} kcal</div>
                            <h1 className={"font-subtitle text-wahaca-navy text-xl"}>INGREDIENTS</h1>
							<div>
								<button
									onClick={handleAddToCart}
									className={`${styles.button} text-lg text-white-500 hover:bg-white-300 hover:translate-x-1`}
                                >
									{" "}
									ADD TO CART
								</button>
							</div>

                            
						</div>
					</div>

					{/* <div className={"grid grid-cols-2 pt-5 flex-grow"}>
						<div className={""}>
							<h1 className={"font-subtitle text-xl"}> INGREDIENTS </h1>
							<ol className={"list-disc"}>
								<pre>{JSON.stringify(props.data.ingredients, undefined, 2)}</pre>
							</ol>
						</div>
					</div> */}
					{/* Need to add more like this section, like alike food type */}
				</div>
			</section>
		</>
	);
}

/**
 * Fetch menu item data on server
 */
export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<{ props: PageProps }> {
	const id = context.query.id as string;

	const response = await fetch(`http://127.0.0.1:5000/api/menu/item/${id}`);
	let menuItem: MenuItemWithIngredientsAndRelated | null = null;

	if (response.status === 200) {
		const data = await response.json();
		menuItem = data.item || null;
	}

	return {
		props: {
			data: menuItem,
		},
	};
}
