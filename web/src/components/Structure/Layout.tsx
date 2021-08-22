import React, { FC, useState, useEffect } from "react";
import { ReactNode } from "react";
import LoginButton from "./LoginButton";
import { User } from "../../types";
import Footer from "./Footer";
import Modal from "react-modal";
import TopSearchBar from "./TopSearchBar";
import { useHotkeys } from "react-hotkeys-hook";
import { SideBar } from "./SideBar";
import { DarkModeCtx } from "../../hooks/use-dark-mode";
import { AiOutlineSearch } from "react-icons/ai";

interface LayoutProps {
    children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children, ...props }: LayoutProps) => {
    const [authenticated, setAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User>();
    const [searchResults, setSearchResults] = useState<[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");

    // TODO: Save theme preference in the cookies (or somewhere else) so that
	// the server can render it.
	const [dark, setDark] = useState(false);

	useEffect(() => {
		setDark(localStorage.getItem("dark") === "true");
	}, []);

	useEffect(() => {
		if (dark) document.documentElement.classList.add("dark");
		else document.documentElement.classList.remove("dark");

		localStorage.setItem("dark", dark.toString());
	}, [dark]);

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
    	<DarkModeCtx.Provider value={{ dark, setDark }}>
			<div className="min-h-screen" {...props}>
				<div className="flex flex-row min-h-screen text-gray-800">
					<SideBar authenticated={authenticated} user={user}/>

					<div className="min-h-screen w-full flex flex-col z-0">
						<div className="px-12 h-full">
							<div className="py-8 top-0 bg-white">
								<header className="header bg-white">
									<div className="header-content flex items-center flex-row">
										<div className="hidden md:flex relative w-full">
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
							</div>

							<main className="h-full main flex flex-col flex-grow transition-all duration-150 ease-in">
								<div className="container mb-24 pb-5 h-full">
									{/* Page Contents here */}
									{children}
								</div>
							</main>
						</div>

						<Footer />
					</div>
				</div>
			</div>
		</DarkModeCtx.Provider>
	);
};

export default Layout;
