import {GridIndex} from "./grid_index";
import MockData from "../../mockdata/menu-data.json";

interface Props {
    data: typeof MockData
}

export default function View_Menu(props: Props) {
    return (
        <section>
            <h1> Menu</h1>
            <div className={"grid grid-cols-3 gap-5"}>
                {props.data.map(item => (
                    <GridIndex
                        link={item.link}
                        image_url={item.src}
                        name={item.name}
                        description={item.description}
                        price={item.price}
                        calories={item.calories}
                    />
                ))}
            </div>
        </section>
    );
}

// Importing data on the server and sending it to the react component above
export function getServerSideProps() {
    const response = MockData;
    return {
        props: {
            data: response
        }
    }
}