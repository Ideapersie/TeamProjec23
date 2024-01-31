import MockData from "../../mockdata/menu-data.json";
import MenuList from "@/components/menu/MenuList";

// The data to be passed in as props
interface Props {
    data: typeof MockData
}

// The View Menu page
export default function ViewMenuPage(props: Props) {
    return (
        <>
            <h1>View Menu</h1>
            <MenuList dishes={props.data}/>
        </>
    );
}

// Loads data on the server (instead of on the browser) -> more secure + data available on page load
export function getServerSideProps(): {props: Props} {

    // TODO: Replace mock data with a call to the backend server here
    const response = MockData;

    // ...and passes it to the ViewMenuPage component via props
    return {
        props: {
            data: response
        }
    };
}