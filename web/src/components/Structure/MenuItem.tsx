import { FC } from "react";

interface MenuItemProps {
    name: string;
    icon: JSX.Element;
    href: string | null;
}
const MenuItem: FC<MenuItemProps> = ({ name, icon, href, ...props }) => (
    <li className="my-px" {...props}>
        <a
            href={href == null ? void 0 : href}
            className="flex flex-row items-center h-10 px-3 rounded-lg text-contrast-600
                hover:bg-contrast-400 hover:text-contrast-700 cursor-pointer"
        >
            <span className="flex items-center justify-center text-lg">
                {icon}
            </span>
            <span className="ml-3">{name}</span>
        </a>
    </li>
);
export default MenuItem;
