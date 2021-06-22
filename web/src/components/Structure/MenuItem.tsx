import { FC } from "react";

interface MenuItemProps {
    name: string;
    icon: JSX.Element;
    href: string;
}
const MenuItem: FC<MenuItemProps> = ({ name, icon, href, ...props }) => (
    <li className="my-px" {...props}>
        <a
            href={href}
            className="flex flex-row items-center h-10 px-3 rounded-lg text-gray-300 hover:bg-gray-100 hover:text-gray-700"
        >
            <span className="flex items-center justify-center text-lg text-gray-400">
                {icon}
            </span>
            <span className="ml-3">{name}</span>
        </a>
    </li>
);
export default MenuItem;
