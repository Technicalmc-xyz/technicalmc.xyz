import Link from "next/link";
import React, { useState } from "react";
import Tag from "./Tag";

interface SearchResultProps {
    urn_title: string;
    title: string;
    tags: string[];
}
export const Search = () => {
    const btnRef = React.useRef(null);
    const [searchResults, setSearchResults] = useState<[]>([]);

    const handleChange = (value: string) => {
        if (value) {
            fetch(`/api/search/${value}`)
                .then((res) => res.json())
                .then((res) => setSearchResults(res))
                .catch((err) => console.log(err));
        } else return;
    };

    const SearchResults = () => {
        if (!searchResults || searchResults.length === 0) return null;
        else {
            return (
                <div className="w-full block border-2 border-gray-900 rounded-bl-xl rounded-br-xl">
                    {searchResults.map(
                        ({ urn_title, title, tags }: SearchResultProps) => (
                            <div className="mb-5">
                                <u>
                                    <p className="text-lg">
                                        <Link
                                            href={`/article/view/${urn_title}`}
                                        >
                                            {title}
                                        </Link>
                                    </p>
                                </u>

                                {tags.map((t: string) => (
                                    <Tag title={t} />
                                ))}
                            </div>
                        )
                    )}
                </div>
            );
        }
    };

    return (
        <>
            <div className="hidden md:flex relative w-3/4">
                <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                    <svg
                        className="h-6 w-6"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    id="search"
                    type="text"
                    name="search"
                    className="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 w-full rounded-lg border border-gray-300 w-full h-10 focus:outline-none focus:border-green-500"
                    placeholder="Search..."
                    ref={btnRef}
                    onChange={(event) => handleChange(event.target.value)}
                />
            </div>
            <SearchResults />
        </>
    );
};
