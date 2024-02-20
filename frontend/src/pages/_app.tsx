import "@/styles/globals.css";
import type {AppProps} from "next/app";
import MainLayout from "@/components/layouts/MainLayout";

export default function App({Component, pageProps, router}: AppProps) {

    const path = router.pathname;

    if (path.startsWith("/auth")) {
        return (
            <Component {...pageProps} />
        );
    }

    return (
        <MainLayout>
            <Component {...pageProps} />
        </MainLayout>
    );
}
