import { FC } from "react";
import Tag from "../Tag";
import Modal from "react-modal";
import { AiOutlineSearch } from "react-icons/ai";

interface SearchResultProps {
    urn_title: string;
    title: string;
    description: string;
    tags: string[];
}

interface TopSearchBarProps {
    searchResults: [];
    searchQuery: string;
    modalIsOpen: boolean;
    closeModal: () => void;
    clearSearchQuery: () => void;
    handleSearchChange: (value: string) => void;
}

const TopSearchBar: FC<TopSearchBarProps> = ({
    searchResults,
    searchQuery,
    modalIsOpen,
    closeModal,
    clearSearchQuery,
    handleSearchChange,
}: TopSearchBarProps) => (
    <Modal
        isOpen={modalIsOpen}
        shouldCloseOnEsc={true}
        onRequestClose={() => {
            closeModal();
            clearSearchQuery();
        }}
        contentLabel="Example Modal"
        className="inset-1/4 absolute bg-gray-50 rounded-3xl p-10 border-2 shadow-lg border-green-300 z-40"
        overlayClassName="bg-gray-100 bg-opacity-50 inset-0 fixed z-30"
    >
        <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <AiOutlineSearch className="text-gray-400" />
            </div>
            <input
                type="text"
                name="price"
                id="price"
                defaultValue={searchQuery}
                className="focus:ring-indigo-500 focus:border-indigo-500 block py-3 w-full pl-10 pr-12 border-gray-300 rounded-md"
                placeholder="Search..."
                autoFocus
                onChange={(event) => handleSearchChange(event.target.value)}
            />
            <div className="absolute inset-y-0 right-4 flex items-center">
                <span className="hidden sm:block text-gray-400 text-sm leading-5 py-0.5 px-1.5 border border-gray-300 rounded-md">
                    Esc
                </span>
            </div>
        </div>
        {searchResults.length < 1 && searchQuery.length > 2 ? (
            <p>
                No results for <i>{searchQuery}</i>
            </p>
        ) : (
            <>
                {searchResults.map(
                    ({
                        urn_title,
                        title,
                        description,
                        tags,
                    }: SearchResultProps) => (
                        <div
                            className="mb-5 p-2 hover:bg-green-100 rounded"
                            key={title}
                        >
                            <p className="text-lg">
                                <a
                                    href={`/article/view/${urn_title}`}
                                    onClick={() => closeModal()}
                                    className="mr-2"
                                >
                                    <u>{title}</u>
                                </a>

                                {tags.map((t: string) => (
                                    <Tag title={t} key={t} />
                                ))}
                            </p>

                            {description}
                        </div>
                    )
                )}
            </>
        )}
    </Modal>
);

export default TopSearchBar;
