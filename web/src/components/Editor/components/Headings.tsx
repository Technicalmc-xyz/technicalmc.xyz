import { StyledElementProps } from "@udecode/slate-plugins";
import { FC } from "react";

export const Heading1: FC<StyledElementProps> = ({ attributes, children }) => {
    const id = children.props.node.children[0].text
        .replace(/\s+/g, "-")
        .toLowerCase();
    return (
        <h1 {...attributes} id={id}>
            {children}
        </h1>
    );
};
export const Heading2: FC<StyledElementProps> = ({ attributes, children }) => {
    const id = children.props.node.children[0].text
        .replace(/\s+/g, "-")
        .toLowerCase();
    return (
        <h2 {...attributes} id={id}>
            {children}
        </h2>
    );
};

