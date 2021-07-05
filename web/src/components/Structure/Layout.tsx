import React, { FC, useState, useEffect } from "react";
import { ReactNode } from "react";
import Image from "next/image";
import MenuItem from "./MenuItem";
import {
    FiBookOpen,
    FiArchive,
    FiUser,
    FiLogOut,
    FiLogIn,
    FiHome,
    FiUsers,
} from "react-icons/fi";
import {
    AiOutlinePlusCircle,
    AiOutlineMail,
    AiOutlineSearch,
} from "react-icons/ai";
import LoginButton from "./LoginButton";
import { User } from "../../types";
import { MdLibraryBooks } from "react-icons/md";
import Footer from "./Footer";
import Modal from "react-modal";
import TopSearchBar from "./TopSearchBar";
import { useHotkeys } from "react-hotkeys-hook";

interface LayoutProps {
    children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children, ...props }: LayoutProps) => {
    const [authenticated, setAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User>();
    const [searchResults, setSearchResults] = useState<[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");

    // Modal Logic
    const [modalIsOpen, setIsOpen] = useState<boolean>(false);
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);
    Modal.setAppElement("#__next");

    useHotkeys("ctrl+k", (event) => {
        openModal();
        event.preventDefault();
    });

    const clearSearchQuery = () => setSearchQuery("");

    useEffect(() => {
        getUser()
            .then((res) => {
                if (res.status !== 401) setAuthenticated(true);
                return res.json();
            })
            .then((res) => setUser(res))
            .catch((e) => console.log(e));
    }, []);

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        if (value) {
            fetch(`/api/search/${value}`)
                .then((res) => res.json())
                .then((res) => setSearchResults(res))
                .catch((err) => console.log(err));
        } else return;
    };

    const getUser = async () => fetch("/api/user/@me");

    return (
        <div className="min-h-screen" {...props}>
            <div className="flex flex-row min-h-screen text-gray-800">
                <aside className="sidebar w-64 md:shadow transform -translate-x-full md:translate-x-0 transition-transform duration-150 ease-in">
                    <div className="sidebar-header flex items-center justify-center py-4">
                        <div className="inline-flex">
                            <a
                                href="/"
                                className="inline-flex flex-row items-center"
                            >
                                <Image
                                    src="/book.png"
                                    alt="TMW"
                                    width={40}
                                    height={40}
                                />
                            </a>
                        </div>
                    </div>
                    <div className="sidebar-content px-4 py-6 sticky top-0">
                        <ul className="flex flex-col w-full">
                            <li className="my-px">
                                <span className="flex font-medium text-sm text-gray-500 px-4 my-4 uppercase">
                                    Wiki
                                </span>
                            </li>
                            <MenuItem name="Home" href="/" icon={<FiHome />} />
                            <MenuItem
                                name="Articles"
                                href="/articles"
                                icon={<FiBookOpen />}
                            />
                            <MenuItem
                                name="New Article"
                                href="/article/new"
                                icon={<AiOutlinePlusCircle />}
                            />
                            <MenuItem
                                name="Archive"
                                href="/archive"
                                icon={<FiArchive />}
                            />

                            <li className="my-px">
                                <span className="flex font-medium text-sm text-gray-500 px-4 my-4 uppercase">
                                    Account
                                </span>
                            </li>

                            {authenticated ? (
                                <>
                                    <MenuItem
                                        name="Profile"
                                        href="/profile/@me"
                                        icon={<FiUser />}
                                    />
                                    <MenuItem
                                        name="Logout"
                                        href="/api/auth/logout"
                                        icon={<FiLogOut color="red" />}
                                    />
                                </>
                            ) : (
                                <MenuItem
                                    name="Login"
                                    href="/api/auth/login"
                                    icon={<FiLogIn color="green" />}
                                />
                            )}

                            {user && user?.rank > 4 ? (
                                <>
                                    <li className="my-px">
                                        <span className="flex font-medium text-sm text-gray-500 px-4 my-4 uppercase">
                                            Admin
                                        </span>
                                    </li>
                                    <MenuItem
                                        name="Articles"
                                        href="/admin/articles"
                                        icon={<MdLibraryBooks />}
                                    />
                                    <MenuItem
                                        name="Users"
                                        href="/admin/users"
                                        icon={<FiUsers />}
                                    />
                                    <MenuItem
                                        name="Message Discord"
                                        href="/admin/message"
                                        icon={<AiOutlineMail />}
                                    />
                                </>
                            ) : null}
                        </ul>
                    </div>
                </aside>
                <main className="main flex flex-col flex-grow -ml-64 md:ml-0 transition-all duration-150 ease-in">
                    <header className="sticky header bg-white shadow py-4 px-4 top-0 z-10">
                        <div className="header-content flex items-center flex-row">
                            <div className="hidden md:flex relative w-3/4">
                                <button
                                    id="search"
                                    name="search"
                                    value={searchQuery}
                                    className="group border px-3 rounded-lg leading-6 flex items-center space-x-2 sm:space-x-4 hover:text-gray-600 transition-colors duration-200 w-full py-2"
                                    // className="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 w-full rounded-lg border border-gray-300 w-full h-10 focus:outline-none focus:border-green-500"
                                    placeholder="Search..."
                                    onClick={openModal}
                                >
                                    <AiOutlineSearch />
                                    <span>Search...</span>
                                    <span className="ml-auto text-gray-400 text-sm leading-5 py-0.5 px-1.5 border border-gray-300 rounded-md">
                                        Ctrl + K
                                    </span>
                                </button>
                            </div>
                            {user ? (
                                <LoginButton
                                    authenticated={authenticated}
                                    user={user}
                                />
                            ) : null}
                        </div>
                    </header>
                    <TopSearchBar
                        searchResults={searchResults}
                        searchQuery={searchQuery}
                        modalIsOpen={modalIsOpen}
                        closeModal={closeModal}
                        clearSearchQuery={clearSearchQuery}
                        handleSearchChange={handleSearchChange}
                    />
                    <div className="container mx-auto mt-12 mb-24 pb-5 h-full">
                        {/* Page Contents here */}
                        {children}
                    </div>
                    <Footer />
                </main>
            </div>
        </div>
    );
};

export default Layout;
