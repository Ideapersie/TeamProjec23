import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router"
import {MenuItem} from "@/types";
import {env} from "../../../../env.config";

/**
 * The props to be passed to our ItemPage page component.
 */
interface PageProps {
    data: MenuItem | null;
}

/**
 * Renders page for viewing a single menu item.
 *
 * @constructor
 * @author Vincent Chapman-Andrews (zlac465@live.rhul.ac.uk)
 */
export default function ItemPage(props: PageProps) {

    const router = useRouter();

    return (
        <>
            <button onClick={() => router.back()}>Go back</button>

            <pre>{JSON.stringify(props, undefined, 2)}</pre>
        </>
    )
}

/**
 * Fetch menu item data on server
 */
export async function getServerSideProps(context: GetServerSidePropsContext): Promise<{ props: PageProps }> {
    const id = context.query.id as string;

    const response = await fetch(env.BACKEND_HOST + "/api/menuitems");
    let allMenuItems = (await response.json()) as MenuItem[];

    const menuItem = allMenuItems.find(item => {
        return item.menuitem_id === parseInt(id);
    }) || null;

    return {
        props: {
            data: menuItem,
        }
    }
}