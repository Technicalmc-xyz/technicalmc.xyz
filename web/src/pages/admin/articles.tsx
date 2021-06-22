import React, { memo, useEffect, useMemo, useState } from "react";
import { FC } from "react";
import { Article } from "../../types";
import Link from "next/link";
import Modal from "react-modal";
import {
    FeatureButton,
    PublicizeButton,
    RemoveButton,
} from "../../components/Articles/Buttons";
import { removeArticle } from "../../components/Articles/Requests";
import Alert from "../../components/Alert";
import TagSelector from "../../components/TagSelector";
import Tag from "../../components/Tag";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
const getArticles = async () => await fetch("/api/all-articles");

const ArticleAdmin = () => {
    const [articleMetadata, setArticleMetadata] = useState<[]>([]);
    const [confirmedTitle, setConfirmTitle] = useState<string>("");
    const [removeTitle, setRemoveTitle] = useState("");
    const [removeId, setRemoveId] = useState(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [authorized, setAuthorized] = useState<boolean>(true);

    const [modalIsOpen, setIsOpen] = useState<boolean>(false);
    // Close and open the modals
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    useEffect(() => {
        getArticles()
            //If the fetch got the data make the state a success
            .then((res) => {
                if (res.status === 401) setAuthorized(false);
                return res.json();
            })
            .then((res) => {
                setArticleMetadata(res);
                setLoading(false);
            })
            //If the fetch was bad set the state of the fecth to failed
            .catch((e) => {
                console.log(e);
                setLoading(false);
                setError(true);
            });
    }, []);

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        if (value) {
            fetch(`/api/search/${value}`)
                .then((res) => res.json())
                .then((res) => setSearchResults(res))
                .catch((err) => console.log(err));
        } else return;
    };

    const ArticleRows = () => {
        if (error) {
            return (
                <Alert
                    type="error"
                    message="We could not reach the API"
                    description="Something may be down"
                />
            );
        }
        if (loading) {
            return <Loader/>
        } else {
            return searchQuery.length > 0 ? (
                <ArticleTable articles={searchResults} />
            ) : (
                <ArticleTable articles={articleMetadata} />
            );
        }
    };
    interface ArticleTableProps {
        articles: Article[];
    }
    // Callback functions that the tagselector calls
    const addTag = (tag: string) => setSelectedTags([...selectedTags, tag]);
    const removeTag = (tag: string) =>
        setSelectedTags(selectedTags.filter((item) => item !== tag));

    const ArticleTable: FC<ArticleTableProps> = ({ articles, ...props }) =>
        useMemo(
            () => (
                <table className="table-auto w-full" {...props}>
                    <thead className="justify-between border-b">
                        <tr>
                            <th className="px-5 text-left">#</th>
                            <th className="px-5 text-left">Title</th>
                            <th className="px-5 text-left">Tags</th>
                            <th className="px-5 text-left">Last Edited</th>
                            <th className="px-5 text-left">Edit Count</th>
                            <th className="px-5 text-left"></th>
                            <th className="px-5 text-left"></th>
                            <th className="px-5 text-left"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {articles
                            .filter(
                                (element) =>
                                    selectedTags.some((t) =>
                                        element.tags.includes(t)
                                    ) || selectedTags.length === 0
                            )
                            .map(
                                (
                                    {
                                        id,
                                        urn_title,
                                        title,
                                        tags,
                                        edit_count,
                                        last_edited,
                                        featured,
                                        publicized,
                                    }: Article,
                                    index
                                ) => (
                                    <tr
                                        key={id}
                                        className={`border-b ${
                                            index % 2 === 0
                                                ? "bg-gray-100"
                                                : null
                                        }`}
                                    >
                                        <td className="text-left px-5">{id}</td>
                                        <td className="text-left px-5">
                                            <Link
                                                href={`/article/view/${urn_title}`}
                                            >
                                                {title}
                                            </Link>
                                        </td>
                                        <td className="text-left px-5">
                                            {tags.map((t) => (
                                                <button
                                                    onClick={() => addTag(t)}
                                                    className="mr-2"
                                                >
                                                    <Tag title={t} />
                                                </button>
                                            ))}
                                        </td>
                                        <td className="text-left px-5 text-xs">
                                            {new Date(
                                                last_edited
                                            ).toLocaleString()}
                                        </td>

                                        <td className="text-left px-5">
                                            {edit_count}
                                        </td>
                                        <td className="text-left px-5">
                                            <FeatureButton
                                                featured={featured}
                                                title={title}
                                                id={id}
                                            />
                                        </td>
                                        <td className="text-left px-5">
                                            <PublicizeButton
                                                publicArticle={publicized}
                                                title={title}
                                                id={id}
                                            />
                                        </td>
                                        <td className="text-left px-5">
                                            <RemoveButton
                                                title={title}
                                                id={id}
                                                remove={() => {
                                                    setIsOpen(true);
                                                    setRemoveTitle(title);
                                                    setRemoveId(id);
                                                    openModal();
                                                }}
                                            />
                                        </td>
                                    </tr>
                                )
                            )}
                    </tbody>
                </table>
            ),
            [articleMetadata, removeTitle, toast]
        );

    if (!authorized) {
        return (
            <Alert
                type="error"
                message="Sorry you are not authorized to acsess this page!"
            />
        );
    } else {
        return (
            <div>
                <TagSelector
                    selectedTags={selectedTags}
                    addTag={addTag}
                    removeTag={removeTag}
                />
                <input
                    id="search"
                    name="description"
                    type="text"
                    onChange={(event) => handleSearch(event.target.value)}
                    placeholder="Search"
                    required
                    maxLength={200}
                    className="appearance-none border-2 border-gray-100 rounded w-full mb-5 mt-5 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500"
                />

                <ArticleRows />
                <div>
                    <Modal
                        isOpen={modalIsOpen}
                        shouldCloseOnEsc
                        onRequestClose={closeModal}
                        contentLabel="Example Modal"
                        className="inset-1/3 absolute bg-gray-50 rounded-xl p-10 border-2 shadow-lg border-green-500"
                        overlayClassName="bg-gray-100 bg-opacity-50 inset-0 fixed"
                    >
                        <h1 className="text-3xl">Delete <i>{removeTitle}</i></h1>
                        <p className="font-bold text-sm">
                            Please confirm by typing the title of the article
                            you want to remove
                        </p>
                        <input
                            type={"text"}
                            onChange={(event) => {
                                setConfirmTitle(event.target.value);
                            }}
                            className="appearance-none border-2 border-gray-100 w-full rounded mb-2 mr-5 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500"
                        />
                        <button
                            onClick={() => closeModal()}
                            className="appearance-none bg-yellow-500 bg-opacity-25 rounded mb-2 py-2 px-4 text-yellow-900 leading-tight mr-3"
                        >
                            Cancel
                        </button>
                        {confirmedTitle === removeTitle ? (
                            <button
                                onClick={() => {
                                    removeArticle(removeId);
                                    toast(`Removed ${removeTitle}`);
                                    closeModal();
                                }}
                                className="appearance-none bg-red-500 bg-opacity-25 rounded mb-2 py-2 px-4 text-red-700 leading-tight"
                            >
                                Delete
                            </button>
                        ) : (
                            <button
                                disabled
                                className="appearance-none bg-gray-500 bg-opacity-25 rounded mb-2 py-2 px-4 text-gray-700 leading-tight"
                            >
                                Delete
                            </button>
                        )}
                    </Modal>
                </div>
            </div>
        );
    }
};
export default memo(ArticleAdmin);
