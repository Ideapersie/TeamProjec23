import styles from "../../components/menu/grid_submenu.module.css";
import MockData from "../../mockdata/menu-data.json";
import {MenuItem} from "@/types";
import {GetServerSidePropsContext} from "next";
import {GridIndex} from "@/components/menu/grid_index";

// Declaring expected prop types
interface Props {
    data: MenuItem[],
    category: string | null
}

// Page component - View Menu
export default function ViewMenu(props: Props) {
    return <>
        <section>
            <h1 className={"mb-2"}>{props.category || "All items"}</h1>
            <p className={"mb-5 text-stone-400"}>All our food is prepared with only the highest-quality ingredients, provided by local independent farms.</p>
            <div className={"grid grid-cols-3 gap-5"}>
                {props?.data.map(item => (
                    <GridIndex
                        key={item.menuitem_id}
                        link={item.link}
                        name={item.name}
                        description={item.description}
                        price={item.price}
                        calories={item.calories}
                        image={item.image}
                    />
                ))}
            </div>
        </section>
    </>
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<{ props: Props }> {

    const category = context.query?.category?.[0] as string | undefined;

    let menuItems = MockData as MenuItem[];

    if (category) {
        menuItems = menuItems.filter(item => item.type === category);
    }

    return {
        props: {
            data: menuItems,
            category: category || null
        }
    }
}