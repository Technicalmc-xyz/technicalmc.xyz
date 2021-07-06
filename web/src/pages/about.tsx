import React from "react";
import Head from "next/head";
import { NextPage } from "next";
import Link from "next/link";

const About: NextPage = () => (
    <div>
        <Head>
            <title>Technical Minecraft Wiki</title>
            <meta
                property="og:title"
                content="About Technical Minecraft Wiki"
            />
            <meta
                property="og:description"
                content={
                    "Wiki dedicated to technical minecraft wiki topics and discussions"
                }
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

        <h1 className="text-2xl w-full text-center">Mission</h1>
        <hr className="dividing-line" />
        <p className="mt-5">
            The mission for the Technical Minecraft Wiki is to gather everyone's
            information into one spot. We believe this will significantly better
            the community by making it easier for new players to start exploring
            the world of technical minecraft.
        </p>

        <h1 className="text-2xl w-full text-center">Contribute</h1>
        <hr />
        <p className="mt-5">
            By far, the best way to contribute to the wiki is to write and edit
            content. While the wiki is relatively new, only time can help fill
            in the holes and cracks of missing content. With your help we can
            write everything there is to know about minecraft, from the simplest
            mechanics to some of the most out of this world ideas and theory.
        </p>
        <p mt-5>
            While this site is not even a year old it is still full of bugs and
            has been many revisions and complete rebuilds. As a result, there
            are bound to be issues, bugs, and features that need to be added. If
            you would like to help code these, please <code>@devs</code> in the{" "}
            <u>
                <Link href={"https://discord.gg/FcTFg2E"}>
                    Technical Minecraft Wiki Discord
                </Link>
            </u>
            . While the code bases are kept private right now so that we can
            reduce the risks of attacks, you can get access to it if you would
            like to contribute.
        </p>
        <p className="mt-5">
            The site is run completely out of Jakku's pocket and although he is
            glad to run it, donations are greatly appreciated and can be donated
            to him through his{" "}
            <u>
                <Link href={"https://streamelements.com/jjakuu/tip"}>
                    stream elements tip link
                </Link>
            </u>
            . All donations go directly to sever hosting for the website.
            Although you do not have to donate to use the site donations greatly
            help keep this project alive.
        </p>
    </div>
);
export default About;
