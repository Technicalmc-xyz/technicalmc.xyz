import React, { useEffect, useState } from "react";
import { FC } from "react";
import { Article } from "../../types";
import Tag from "../Tag";
import Link from "next/dist/client/link";

interface FeaturedArticlesProps {}

const getFeaturedArticles = async () => fetch("/api/featured-articles");
export const FeaturedArticles: FC<FeaturedArticlesProps> = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [, setLoading] = useState<boolean>(false);
    const [, setError] = useState<boolean>(false);
    useEffect(() => {
        getFeaturedArticles()
            .then((res) => res.json())
            .then((res) => {
                setArticles(res);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
                setError(true);
            });
    }, []);

    return (
        <div>
            {articles.length > 0 ? (
                <>
                    <h1 className="text-xl mb-5">Featured Articles</h1>
                    {articles.map(
                        ({
                            urn_title,
                            title,
                            id,
                            tags,
                            last_edited,
                        }: Article) => (
                            <div key={id}>
                                <div className="border-2 rounded-md p-5 mb-3 hover:border-purple-500">
                                    <div className="flex relative">
                                        <h1 className="mr-10 text-lg">
                                            <Link
                                                href={`/article/view/${urn_title}`}
                                            >
                                                <a>{title}</a>
                                            </Link>
                                        </h1>
                                        {tags.map((t) => (
                                            <div className="ml-2" key={t}>
                                                <Tag title={t} key={t} />
                                            </div>
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
                </>
            ) : null}
        </div>
    );
};
