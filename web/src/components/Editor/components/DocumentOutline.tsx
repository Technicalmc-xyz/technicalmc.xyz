import { FC } from "react";
import { Editor } from "slate";

interface DocumentOutlineProps {
    editor: Editor;
}
interface HeadingTypes {
    type: "h1" | "h2";
    contents: string;
    index?: number;
    subIndex: number;
}
interface CreateHashLinkProps {
    contents: string;
}
const CreateHashLink: FC<CreateHashLinkProps> = ({ contents }) => (
    <a
        href={`#${contents.replace(/\s+/g, "-").toLowerCase()}`}
        className="text-blue-500"
    >
        {contents}
    </a>
);
export const DocumentOutline: FC<DocumentOutlineProps> = ({ editor }) => {
    let index = 0;
    let subIndex = 0;
    // @ts-ignore
    let headings: HeadingTypes[] = editor.children
        // @ts-ignore
        .filter((element) => element.type === "h1" || element.type === "h2")
        .map((current) => {
            // @ts-ignore
            if (current.type === "h1") {
                index++;
                subIndex = 0;
                return {
                    // @ts-ignore
                    type: current.type,
                    // @ts-ignore
                    contents: current.children[0].text,
                    index: index,
                };
            } else {
                subIndex++;
                return {
                    // @ts-ignore
                    type: current.type,
                    // @ts-ignore
                    contents: current.children[0].text,
                    index: index,
                    subIndex: subIndex,
                };
            }
        });

    return (
        <div className="border p-5 my-5 w-min bg-gray-50 whitespace-nowrap">
            <h4>Document Outline</h4>
            <ul className="ml-5">
                {headings.map(
                    ({ type, contents, index, subIndex }: HeadingTypes) => (
                        <li key={contents}>
                            {type === "h2" ? (
                                <ul className="ml-5">
                                    <li>
                                        {index}.{subIndex}{" "}
                                        <CreateHashLink contents={contents} />
                                    </li>
                                </ul>
                            ) : (
                                <>
                                    {index}{" "}
                                    <CreateHashLink contents={contents} />
                                </>
                            )}
                        </li>
                    )
                )}
            </ul>
        </div>
    );
};
