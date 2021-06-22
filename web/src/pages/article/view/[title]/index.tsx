import React, { useState } from "react";
import Head from "next/head";
import { GetServerSideProps, NextPage } from "next";
import { ParsedUrlQuery } from "querystring";
import { ArticleResponse } from "../../../../types";
import ArticleEditor from "../../../../components/Editor/ArticleEditor";

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
    const title = getTitle(params);
    if (!title) {
        return {
            notFound: true,
        };
    }
    const result = await fetch(`http://localhost:3000/api/article/${title}`);
    if (!result.ok) {
        res.statusCode = result.status;
        return { notFound: true };
    }
    const data: ArticleResponse = await result.json();
    return { props: { data } };
};

const Article: NextPage<{ data: ArticleResponse }> = (props) => {
    const [title] = useState<string>(props.data.title);
    const [lastEdited] = useState(props.data.last_edited);
    const [value] = useState(props.data.body);
    return (
        <div>
            <Head>
                <meta
                    property="og:title"
                    content={`${title} | Technical Minecraft Wiki`}
                    key="title"
                />
                <meta
                    property="og:description"
                    content={props.data.description}
                />
                <meta
                    property="og:image"
                    content="https://static.wikia.nocookie.net/minecraft/images/d/d3/KnowledgeBookNew.png/revision/latest/top-crop/width/220/height/220?cb=20190917030625"
                />

                <title>{`${title} | Technical Minecraft Wiki`}</title>
                {/*JSON for Linking Data for SEO*/}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "NewsArticle",
                            mainEntityOfPage: {
                                "@type": "WebPage",
                                "@id": "https://technicalmc.xyz",
                            },
                            headline: title,
                            image: [
                                "https://static.wikia.nocookie.net/minecraft/images/d/d3/KnowledgeBookNew.png/revision/latest/top-crop/width/220/height/220?cb=20190917030625",
                                "https://static.wikia.nocookie.net/minecraft/images/d/d3/KnowledgeBookNew.png/revision/latest/top-crop/width/100/height/100?cb=20190917030625",
                                "https://static.wikia.nocookie.net/minecraft/images/d/d3/KnowledgeBookNew.png/revision/latest/top-crop/width/40/height/40?cb=20190917030625",
                            ],
                            datePublished: lastEdited,
                            dateModified: lastEdited,
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
            <h1 className="text-5xl underline">{props.data.title}</h1>
            <p className="text-sm italic mb-10">
                Last edited: {new Date(props.data.last_edited).toLocaleString()}
            </p>
            <ArticleEditor initValue={value} readonly={true} />
        </div>
    );
};
export default Article;
