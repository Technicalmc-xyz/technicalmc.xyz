import Image from "next/image";
import { FeaturedArticles } from "../components/Articles/FeaturedArticles";
import Head from "next/head";
const Index = () => (
    <div>
        <Head>
            <title>Technical Minecraft Wiki</title>
            <meta
                property="og:title"
                content="Technical Minecraft Wiki"
            />
            <meta
                property="og:description"
                content="The center of information for the technical minecraft community."
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
        <div className="flex flex-column flex-wrap items-center rounded border p-5 mb-5">
            <div className="flex w-full">
                <h1 className="w-full text-xl">
                    Welcome to the Technical Minecraft Wiki!
                </h1>
                <Image
                    src="/book.png"
                    alt={"book"}
                    height={50}
                    width={50}
                    className="right-0"
                />
            </div>
            <i className="w-full">
                The center of information for the technical minecraft community.
            </i>
            <p></p>
        </div>
        <FeaturedArticles />
    </div>
);
export default Index;
