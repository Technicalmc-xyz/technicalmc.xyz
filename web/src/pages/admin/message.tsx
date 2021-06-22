import { useState } from "react";
import { ChangeEvent } from "react";
import Alert from "../../components/Alert";
interface Field {
    name: string;
    value: string;
    inline: boolean;
}

const Message = () => {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [footer, setFooter] = useState<string>("");
    const [fields, setFields] = useState<Field[]>([]);
    const [success, setSuccess] = useState<boolean>(false);
    const handleChange = (
        i: number,
        event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
        const values = [...fields];
        if (event.target.name === "name") {
            values[i].name = event.target.value;
        }
        if (event.target.name === "value") {
            values[i].value = event.target.value;
        } else {
            values[i].inline = event.target.value === "on" ? true : false;
        }

        setFields(values);
    };

    const handleAdd = () => {
        setFields([...fields, { name: "", value: "", inline: false }]);
    };

    const handleRemove = (i: number) => {
        const copy = [...fields];
        copy.splice(i, 1);
        setFields(copy);
    };

    const handleSubmit = () => {
        const body = JSON.stringify({
            title: title,
            description: description,
            fields: fields,
            footer: footer,
        });
        fetch("/api/message/new", {
            method: "POST",
            body: body,
            redirect: "follow",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Methods": "POST",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
        })
            .then(async (response) => {
                if (response.ok) {
                    setSuccess(true);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };
    if (success) {
        return <Alert type="success" message="Message sent successfully" />;
    } else {
        return (
            <div>
                <h1>Discord Webhook Builder for Annoucments</h1>
                <input
                    id="title"
                    name="title"
                    type="text"
                    onChange={(event) => {
                        setTitle(event.target.value);
                    }}
                    placeholder="Title"
                    required
                    maxLength={200}
                    className="appearance-none border-2 border-gray-100 rounded w-full mb-2 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500"
                />
                <input
                    id={"description"}
                    name="description"
                    type="text"
                    onChange={(event) => {
                        setDescription(event.target.value);
                    }}
                    placeholder="Description"
                    required
                    maxLength={200}
                    className="appearance-none border-2 border-gray-100 rounded w-full mb-2 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500"
                />

                {fields.map((_field, i) => (
                    <div key={i} className="mb-5">
                        <input
                            name="name"
                            placeholder="Name"
                            onChange={(e) => handleChange(i, e)}
                            className="appearance-none border-2 border-gray-100 rounded mb-2 mr-2 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500"
                        />
                        Inline
                        <input
                            name="inline"
                            type="checkbox"
                            onChange={(e) => handleChange(i, e)}
                            className="ml-1"
                        />
                        <textarea
                            name="value"
                            placeholder="Value"
                            onChange={(e) => handleChange(i, e)}
                            className="appearance-none border-2 border-gray-100 w-full rounded mb-2 mr-2 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500"
                        />
                        <button
                            onClick={() => handleRemove(i)}
                            className="appearance-none bg-red-500 bg-opacity-25 rounded mb-2 py-2 px-4 text-red-700 leading-tight"
                        >
                            Remove
                        </button>
                    </div>
                ))}
                <button
                    onClick={() => handleAdd()}
                    className="appearance-none bg-green-500 bg-opacity-25 rounded mb-2 py-2 px-4 text-green-700 leading-tight"
                >
                    Add field
                </button>
                <input
                    id={"footer"}
                    name="footer"
                    type={"text"}
                    onChange={(event) => {
                        setFooter(event.target.value);
                    }}
                    placeholder="Footer"
                    required
                    maxLength={200}
                    className="appearance-none border-2 border-gray-100 rounded w-full mb-2 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500"
                />
                <button
                    onClick={() => handleSubmit()}
                    className="appearance-none bg-green-500 bg-opacity-25 rounded mb-2 py-2 px-4 text-green-700 leading-tight"
                >
                    Submit
                </button>
            </div>
        );
    }
};
export default Message;
