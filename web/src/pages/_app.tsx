import React from "react";
import { AppProps } from "next/app";
import "../styles/global.css";
import { ToastContainer, Slide } from "react-toastify";

import 'react-toastify/dist/ReactToastify.css';
import { Layout } from "../components/Structure";
const App = ({ Component, pageProps }: AppProps) => (
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

export default App;
