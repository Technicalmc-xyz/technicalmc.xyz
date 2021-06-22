import React from "react";
import Alert from "../components/Alert";
const Help = () => (
    <div>
        <h1 className="text-2xl underline mb-5">Technical Minecraft Wiki Help Page</h1>
        <Alert type="info" message="Attention!" description="This help page is for the wiki website and not minecraft questions"/>
        {/* <p className="text-green-800 bg-green-200 rounded text-center my-5 p-2"><u><strong>Attention!</strong> This page is for help with the wiki website its self and not questions about Minecraft</u></p> */}
        <p className="mt-5">
            Most of the help that you will need you can fist check the <a href="/faq" className="underline text-blue-500">FAQ page</a>
            {" "}where we answer some commonly asked questions, otherwise head on
            over to the <a href="https://discord.gg/FcTFg2E" className="underline text-blue-500">discord</a> for questions that arent answered there.
        </p>
    </div>
);

export default Help;
