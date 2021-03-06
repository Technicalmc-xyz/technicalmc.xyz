import React from "react";
import { NextPage } from "next";
import Head from "next/head";
const Faq: NextPage = () => (
    <div>
        <Head>
            <title>Technical Minecraft Wiki</title>
            <meta
                property="og:title"
                content="FAQ | Technical Minecraft Wiki"
            />
            <meta
                property="og:description"
                content="Some of the most commonly asked questions about the technical minecraft wiki."
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
                        headline: "About",
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
        <div className="space-y-6 w-full">
            <h1 className="text-2xl w-full text-center">
                Frequently Asked Questions
            </h1>
            <p className="text-center">
                Some of the most commonly asked questions about the technical
                minecraft wiki.
            </p>
            <hr />
            <details className="p-3 border rounded-lg">
                <summary className="text-lg w-full font-bold">
                    Why cannot I not see my new article after I created it?
                </summary>
                <p className="mt-5">
                    A: Although we like to see everyones new information brought
                    to the site we also want to prevent spam and new articles on
                    topics that we find off topic{" "}
                </p>
            </details>
            <details className="p-3 border rounded-lg">
                <summary className="text-lg w-full font-bold">
                    How do I install (fill in the blank) mod?
                </summary>
                <p className="mt-5">
                    While mods are a large part of the technical aspect of
                    minecraft we do not aim to support mod help or any specifics
                    on mods
                </p>
            </details>
        </div>
    </div>
);

export default Faq;
