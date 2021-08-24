import React from "react";
import { User } from "../../types";
import Image from "next/image";
import MenuItem from "./MenuItem";
import { FiArchive, FiBookOpen, FiHome, FiLogIn, FiLogOut, FiUser, FiUsers } from "react-icons/fi";
import { AiOutlineMail, AiOutlinePlusCircle } from "react-icons/ai";
import { MdLibraryBooks } from "react-icons/md";
import { FaLightbulb, FaRegLightbulb } from "react-icons/fa";
import { useDarkMode } from "../../hooks/use-dark-mode";

export const SideBar: React.FC<{
	authenticated: boolean,
	user?: User
}> = ({ authenticated, user }) => {
	const { dark, setDark } = useDarkMode();

	return (
		<aside
			className="sidebar w-64 shadow-sidebar-custom transform -translate-x-full md:translate-x-0 transition-transform hidden
				md:block duration-150 ease-in z-10 bg-contrast-300">
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
			<nav className="sidebar-content px-4 py-6 sticky top-0">
				<ul className="flex flex-col w-full">
					<li className="my-px">
					<span className="flex font-medium text-sm text-contrast-700 px-4 my-4 uppercase">
						Wiki
					</span>
					</li>
					<MenuItem name="Home" href="/" icon={<FiHome/>}/>
					<MenuItem
						name="Articles"
						href="/articles"
						icon={<FiBookOpen/>}
					/>
					<MenuItem
						name="New Article"
						href="/article/new"
						icon={<AiOutlinePlusCircle/>}
					/>
					<MenuItem
						name="Archive"
						href="/archive"
						icon={<FiArchive/>}
					/>

					<li className="my-px">
					<span className="flex font-medium text-sm text-contrast-700 px-4 my-4 uppercase">
						Account
					</span>
					</li>

					{authenticated ? (
						<>
							<MenuItem
								name="Profile"
								href="/profile/@me"
								icon={<FiUser/>}
							/>
							<MenuItem
								name="Logout"
								href="/api/auth/logout"
								icon={<FiLogOut color="#ff4843"/>}
							/>
						</>
					) : (
						<MenuItem
							name="Login"
							href="/api/auth/login"
							icon={<FiLogIn color="#29b84c"/>}
						/>
					)}

					{user && user?.rank > 4 ? (
						<>
							<li className="my-px">
							<span className="flex font-medium text-sm text-contrast-700 px-4 my-4 uppercase">
								Admin
							</span>
							</li>
							<MenuItem
								name="Articles"
								href="/admin/articles"
								icon={<MdLibraryBooks/>}
							/>
							<MenuItem
								name="Users"
								href="/admin/users"
								icon={<FiUsers/>}
							/>
							<MenuItem
								name="Message Discord"
								href="/admin/message"
								icon={<AiOutlineMail/>}
							/>
						</>
					) : null}

					<li className="my-px">
					<span className="flex font-medium text-sm text-contrast-700 px-4 my-4 uppercase">
						UI
					</span>
					</li>
					<span onClick={() => setDark(!dark)}>
						<MenuItem
							name={`${dark ? "Light" : "Dark"} Mode`}
							href={null}
							icon={dark ? <FaLightbulb/> : <FaRegLightbulb/>}
						/>
					</span>
				</ul>
			</nav>
		</aside>
	);
}
