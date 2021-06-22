import Image from "next/image";
import { FeaturedArticles } from "../components/Articles/FeaturedArticles";
const Index = () => (
    <div>
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
            <p>
  
            </p>
        </div>
        <FeaturedArticles />
    </div>
);
export default Index;
