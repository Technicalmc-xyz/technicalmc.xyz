import { StyledElementProps } from "@udecode/slate-plugins";
import { FC } from "react";

export const CustomOrderedList: FC<StyledElementProps> = ({
    attributes,
    children,
}) => (
    <ol className="list-decimal ml-7" {...attributes}>
        {children}
    </ol>
);

export const CustomUnorderedList: FC<StyledElementProps> = ({
    attributes,
    children,
}) => (
    <ul className="list-disc ml-7" {...attributes}>
        {children}
    </ul>
);
