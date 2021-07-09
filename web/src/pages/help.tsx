import React from "react";
import Alert from "../components/Alert";
const Help = () => (
    <div>
        <Alert
            type="info"
            message="Attention!"
            description="This help page is for the wiki website and NOT for minecraft specific questions"
        />
        <h1 className="my-5">Technical Minecraft Wiki Help Page</h1>
        <h2 className="mt-5">Article Editor Help</h2>
        <p>
            The article editor has a lot of features that you might be unaware
            of or you might not know how to use. The editor is supposed to be as
            intuitive as possible ,however, some of the featues are not as
            noticeable as others. This section is here to help with showing
            things on the editor that maybe arent noticeable.
        </p>
        <h3 className="mt-5">Markdown auto-complete</h3>
        <section>
            <ul className="list-group">
                <li>
                    <kbd># + space</kbd>: will create a heading. The size of the
                    heading depends on the number of hashses, e.g one # will
                    create a Heading-One and ### will create a Heading-Three
                </li>
                <li>
                    <kbd>__</kbd>[text]<kbd>__</kbd>: Will create bold text
                </li>
                <li>
                    <kbd>**</kbd>[text]<kbd>**</kbd>: Will create bold text
                </li>
                <li>
                    <kbd>_</kbd>[text]<kbd>_</kbd>: Will create italic text
                </li>
                <li>
                    <kbd>*</kbd>[text]<kbd>*</kbd>: Will create italic text
                </li>
                <li>
                    <kbd>`</kbd>[text]<kbd>`</kbd>: Will create code text
                </li>
                <li>
                    <kbd>```</kbd>[text]<kbd>```</kbd>: Will create a code block
                </li>
                <li>
                    <kbd>~~</kbd>[text]<kbd>~~</kbd>: Will create strikethrough text
                </li>
                <li>
                    <kbd>* + space</kbd>: will created a bulleted list
                </li>
                <li>
                    <kbd>- + space</kbd>: will created a bulleted list
                </li>
            </ul>
        </section>
    </div>
);

export default Help;
