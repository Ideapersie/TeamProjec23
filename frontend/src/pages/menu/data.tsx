import Link from "next/link"
// Describing what data should be passed in as props
interface Props {
    link: string
    image_url: string
    name: string
    description: string
    price: string
    calories: number
}

export default function Data(props: Props) {
	return(
		<section>
			<div>
				<Link href = {props.link}>
					<img
						src = {props.image_url}
						alt = {'${props.name} image'}
						width = "600"
						height = "600"
					/>
				</Link>

				<div>{props.name}</div>
				<div>{props.description}</div>
				<div>{props.price}</div>
				<div>{props.calories}</div>
			</div>
		</section>	
	);
}