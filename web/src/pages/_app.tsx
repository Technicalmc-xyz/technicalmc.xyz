import React, { useEffect } from "react";
import { AppProps } from "next/app";
import "../styles/global.css";
import { Layout } from "../components/Structure";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as ga from "../ga/gtag";
const isProduction = process.env.NODE_ENV === "production";

import { useRouter } from "next/dist/client/router";
const App = ({ Component, pageProps }: AppProps) => {
    const router = useRouter();

    useEffect(() => {
        const handleRouteChange = (url: URL) => {
            /* invoke analytics function only for production */
            if (isProduction) ga.pageview(url);
        };
        router.events.on("routeChangeComplete", handleRouteChange);
        return () => {
            router.events.off("routeChangeComplete", handleRouteChange);
        };
    }, [router.events]);
    // eslint-disable-next-line react/jsx-props-no-spreading
    return (
        <>
            <ToastContainer
                className="impct-toast"
                position="top-right"
                autoClose={3000}
                hideProgressBar
                newestOnTop
                closeOnClick
                rtl={false}
                draggable={false}
                pauseOnHover
                transition={Slide}
            />
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </>
    );
};

export default App;
