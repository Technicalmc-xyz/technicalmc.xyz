import React, { memo, useEffect, useState } from "react";
import Link from "next/link";
import { FC } from "react";
import { Article } from "../types";
import Alert from "../components/Alert";
import Loader from "../components/Loader";
import Tag from "../components/Tag";
import TagSelector from "../components/TagSelector";
;

const Articles = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [metadata, setMetadata] = useState<Article[]>([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        if (value) {
            fetch(`/api/search/${value}`)
                .then((res) => res.json())
                .then((res) => setSearchResults(res))
                .catch((err) => console.log(err));
        } else return;
    };

    useEffect(() => {
        getArticleMetadata()
            .then((res) => res.json())
            .then((res) => {
                setMetadata(res);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
                setError(true);
            });
    }, []);

    const getArticleMetadata = async () => fetch("/api/public-articles");

    const ArticleCard = () => {
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
                <ListArticles articles={searchResults} />
            ) : (
                <ListArticles articles={metadata} />
            );
        }
    };

    interface ListArticleProps {
        articles: Article[];
    }
    // Callback functions that the tagselector calls
    const addTag = (tag: string) => setSelectedTags([...selectedTags, tag]);
    const removeTag = (tag: string) =>setSelectedTags(selectedTags.filter((item) => item !== tag));

    const ListArticles: FC<ListArticleProps> = ({ articles, ...props }) => {
        if (articles.length === 0) {
            return (
                <p>
                    We could not find any results for the search term{" "}
                    <i>{searchQuery}</i>
                </p>
            );
        }
        return (
            <div {...props}>
                {articles
                    .filter(
                        (element) =>
                            selectedTags.some((t) =>
                                element.tags.includes(t)
                            ) || selectedTags.length === 0
                    )
                    .map(
                        ({
                            urn_title,
                            title,
                            id,
                            tags,
                            last_edited,
                        }: Article) => (
                            <div key={id}>
                                <div
                                    className="border-2 rounded-md p-5 mb-3 hover:border-green-500"
                                    // bg={featured ? "purple.100": null}
                                >
                                    <div className="flex relative">
                                        <h1 className="mr-10 text-lg">
                                            <Link
                                                href={`/article/view/${urn_title}`}
                                            >
                                                <a>{title}</a>
                                            </Link>
                                        </h1>
                                        {tags.map((t) => (
                                            <button
                                                onClick={() =>
                                                    setSelectedTags([
                                                        ...selectedTags,
                                                        t,
                                                    ])
                                                }
                                                className="mr-2"
                                            >
                                                <Tag title={t} key={t}/>
                                            </button>
                                        ))}
                                        <p className="absolute right-0 text-sm">
                                            {new Date(
                                                last_edited
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    )}
            </div>
        );
    };

    return (
        <div>
            <TagSelector selectedTags={selectedTags} addTag={addTag} removeTag={removeTag} />
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
            <ArticleCard />
        </div>
    );
};
export default memo(Articles);
