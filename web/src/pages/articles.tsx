import React, { memo, useEffect, useState } from "react";
import Link from "next/link";
import { FC } from "react";
import { Article } from "../types";
import Alert from "../components/Alert";
import Loader from "../components/Loader";
import Tag from "../components/Tag";
import TagSelector from "../components/TagSelector";
import Head from "next/head";
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
            return <Loader />;
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
    const removeTag = (tag: string) =>
        setSelectedTags(selectedTags.filter((item) => item !== tag));

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
                                                <Tag title={t} key={t} />
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
            <Head>
                <title>Articles | Technical Minecraft Wiki</title>
                <meta
                    property="og:title"
                    content="Articles | Technical Minecraft Wiki"
                />
                <meta
                    property="og:description"
                    content="The latest and greatest articles from the technical minecraft wiki."
                />
                <meta
                    property="og:image"
                    content="https://static.wikia.nocookie.net/minecraft/images/d/d3/KnowledgeBookNew.png/revision/latest/top-crop/width/220/height/220?cb=20190917030625"
                />
                <meta property="og:url" content="https://technicalmc.xyz" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "NewsArticle",
                            mainEntityOfPage: {
                                "@type": "WebPage",
                                "@id": "https://technicalmc.xyz/about",
                            },
                            headline: "Technical Minecraft Wiki",
                            image: [
                                "https://static.wikia.nocookie.net/minecraft/images/d/d3/KnowledgeBookNew.png/revision/latest/top-crop/width/220/height/220?cb=20190917030625",
                                "https://static.wikia.nocookie.net/minecraft/images/d/d3/KnowledgeBookNew.png/revision/latest/top-crop/width/100/height/100?cb=20190917030625",
                                "https://static.wikia.nocookie.net/minecraft/images/d/d3/KnowledgeBookNew.png/revision/latest/top-crop/width/40/height/40?cb=20190917030625",
                            ],
                            datePublished: "2021-02-25T18:55:25Z",
                            dateModified: "2021-02-25T18:55:25Z",
                            author: {
                                "@type": "Organization",
                                name: "Technical Minecraft Wiki",
                            },
                            publisher: {
                                "@type": "Organization",
                                name: "Technical Minecraft Wiki",
                                logo: {
                                    "@type": "ImageObject",
                                    url:
                                        "https://static.wikia.nocookie.net/minecraft/images/d/d3/KnowledgeBookNew.png/revision/latest/top-crop/width/220/height/220?cb=20190917030625",
                                },
                            },
                        }),
                    }}
                />
            </Head>
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
            <ArticleCard />
        </div>
    );
};
export default memo(Articles);
