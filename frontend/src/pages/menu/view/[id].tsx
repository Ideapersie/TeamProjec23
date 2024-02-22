import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router"

export default function ItemPage() {

    const router = useRouter();

    return (
        <>
            Viewing item: {router.query.id}
        </>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<{ props: any }> {

    const id = context.query?.id?.[0] as string | undefined;

    //To do filter

    return {
        props: {
            data: menuItems,
            category: category || null
        }
    }
}