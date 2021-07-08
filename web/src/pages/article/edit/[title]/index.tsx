import React, { FC, useState, useEffect } from "react";
import Head from "next/head";
import { GetServerSideProps, NextPage } from "next";
import {
    SlateDocument,
    UseSlatePluginsEffectsOptions,
    SPEditor,
} from "@udecode/slate-plugins";
import { ParsedUrlQuery } from "querystring";
import { FailedPost } from "../../../../components/Article/FailedPost";
import { ArticleResponse } from "../../../../types";
import ArticleEditor from "../../../../components/Editor/ArticleEditor";
import TagSelector from "../../../../components/TagSelector";
import Alert from "../../../../components/Alert";

const getTitle = (params?: ParsedUrlQuery) => {
    if (!params?.title) {
        return null;
    }
    const { title } = params;
    return Array.isArray(title) ? title[0] : title;
};

export const getServerSideProps: GetServerSideProps = async ({
    params,
    res,
}) => {
    const urn_title = getTitle(params);
    if (!urn_title) {
        return {
            notFound: true,
        };
    }

    const result = await fetch(
        `http://localhost:3000/api/article/${urn_title}`
    );
    if (!result.ok) {
        res.statusCode = result.status;
        return { notFound: true };
    }
    const data: ArticleResponse = await result.json();
    return { props: { data } };
};

const EditArticle: NextPage<{ data: ArticleResponse }> = (props) => {
    if (!props.data) {
        return (
            <Alert
                type="error"
                message="Sorry we could not find this article!"
            />
        );
    }

    const [authenticated, setAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        getUser()
            .then((res) => {
                if (res.status !== 401) setAuthenticated(true);
            })
            .catch((e) => console.log(e));
    }, []);

    const getUser = async () => fetch("/api/user/@me");

    // const [loading, setLoading] = useState<boolean>(false);
    const [title, setTitle] = useState<string>(props.data.title);
    const [description, setDescription] = useState<string>(
        props.data.description
    );
    const [selectedTags, setSelectedTags] = useState<string[]>(props.data.tags);
    const value: UseSlatePluginsEffectsOptions<SPEditor> = props.data.body;
    const [signOff, setSignOff] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [success, setSuccess] = useState(false);
    const [, setSubmitted] = useState(false);
    const [failed, setFailed] = useState(false);
    const [failedMessage, setFailedMessage] = useState<string>("");

    if (!authenticated) {
        return (
            <Alert
                type={"error"}
                message="You must be logged in order to edit this article"
            />
        );
    }
    const SubmitButton: FC = () => {
        if (signOff && message.length > 0) {
            return (
                <button
                    className="border rounded-lg px-5 py-2 bg-green-200 text-green-900 hover:bg-green-300 text-sm"
                    onClick={submitArticle}
                >
                    Submit Edits
                </button>
            );
        } else {
            return null;
        }
    };

    const submitArticle = () => {
        if (selectedTags.length < 1 || selectedTags.length > 4) {
            setFailedMessage("You must select between 1 and 3 tags!");
            setFailed(true);
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            return null;
        } else if (title.length < 5) {
            setFailedMessage(
                "You must have a title with a length of 5 or greater!"
            );
            setFailed(true);
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            return null;
        } else if (description.length < 10) {
            setFailedMessage(
                "You must have a description with a length of 10 or greater!"
            );
            setFailed(true);
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            return null;
        } else if (!window.localStorage.getItem("content")) {
            setFailedMessage(
                "It looks like the content of the article has not been stored in the browser, please save your work and refresh and try again."
            );
            setFailed(true);
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            return null;
        }

        const body = JSON.stringify({
            title: title,
            description: description,
            tags: selectedTags,
            edit_count: props.data.edit_count,
            message: message,
            body: JSON.parse(window.localStorage.getItem("content") || "{}"),
        });
        fetch(`/api/edit-article/${props.data.urn_title}`, {
            method: "POST",
            body: body,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST",
                "Access-Control-Allow-Headers": "*",
            },
        })
            .then((res) => {
                if (res.ok) {
                    setSubmitted(true);
                    setSuccess(true);
                } else {
                    setFailed(true);
                    res.text().then((r) => setFailedMessage(r));
                }
            })
            .catch(() => {
                setFailed(true);
            });
    };

    const addTag = (tag: string) => setSelectedTags([...selectedTags, tag]);
    const removeTag = (tag: string) =>
        setSelectedTags(selectedTags.filter((item) => item !== tag));

    if (success) {
        return (
            <Alert
                type="success"
                message="Article Submitted!"
                description="Thank you for your edit! We appreciate deeply your
                    contribution to this wiki. If you would like the poster role
                    on the discord just ping one of the moderators!"
            />
        );
    } else {
        return (
            <div>
                <Head>
                    <meta property="og:title" 
                    content={title} 
                    key="title" />
                    <meta
                        property="og:description"
                        content={props.data.description}
                    />
                    <meta
                        property="og:image"
                        content="https://static.wikia.nocookie.net/minecraft/images/d/d3/KnowledgeBookNew.png/revision/latest/top-crop/width/220/height/220?cb=20190917030625"
                    />

                    <title>{title}</title>
                    {/*JSON for Linking Data for SEO*/}
                </Head>
                <FailedPost message={failedMessage} failed={failed} />
                <div>
                    <input
                        id={"title"}
                        type={"text"}
                        maxLength={50}
                        required
                        onChange={(event) => {
                            setTitle(event.target.value);
                        }}
                        name={"title"}
                        placeholder="Title"
                        defaultValue={title}
                        className="appearance-none border-2 border-gray-100 rounded w-full mb-2 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500"
                    />
                    <input
                        id={"description"}
                        type={"text"}
                        maxLength={200}
                        required
                        onChange={(event) => {
                            setDescription(event.target.value);
                        }}
                        placeholder="Description"
                        name="description"
                        defaultValue={description}
                        className="appearance-none border-2 border-gray-100 rounded w-full mb-2 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500"
                    />
                    <TagSelector
                        addTag={addTag}
                        removeTag={removeTag}
                        selectedTags={selectedTags}
                    />
                    <ArticleEditor
                        initValue={value}
                        readonly={false}
                        placeholder={"Start writing ..."}
                    />
                    <input
                        onChange={(event) => {
                            setMessage(event.target.value);
                            setSignOff(true);
                        }}
                        placeholder={"Describe what you changed"}
                        name={"message"}
                        className="appearance-none border-2 mt-10 border-gray-100 rounded w-full mb-2 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-yellow-500"
                    />
                    {signOff && message.length > 0 ? (
                        <div className="mt-10" />
                    ) : (
                        <div className="mt-10">
                            <Alert
                                type="warning"
                                message="Please provide an edit message of what you changed
                            before submitting."
                            />
                        </div>
                    )}
                    <SubmitButton />
                </div>
            </div>
        );
    }
};

export default EditArticle;
