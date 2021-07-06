import React from "react";
import { NextPage } from "next";
import Head from "next/head";
const Contact: NextPage = () => (
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
            <h1 className="text-2xl w-full text-center">Contact</h1>
            <section className="text-lg text-center">
                If you need to contact the Technical Minecraft Wiki please do so
                via our
                <a
                    target="_blank"
                    href="https://discord.gg/FcTFg2E"
                    className="text-blue-500 hover:text-grey-dark"
                >
                    {" "}
                    discord server{" "}
                </a>
            </section>
        </div>
    </div>
);

export default Contact;
