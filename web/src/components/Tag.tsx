import { FC } from "react";
interface TagProps {
    title: string;
    selected?: boolean;
}

const Tag: FC<TagProps> = ({ title, selected = true, ...props }) =>
    selected ? (
        <span
            className="text-sm font-medium bg-green-200 bg-opacity-75 text-green-700 font-bold py-1 px-2 rounded align-middle"
            {...props}
        >
            {title}
        </span>
    ) : (
        <span
            className="text-sm font-medium bg-gray-100 font-bold py-1 px-2 rounded align-middle"
            {...props}
        >
            {title}
        </span>
    );
export default Tag;
