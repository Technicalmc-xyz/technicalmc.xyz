import { tags } from "../types";
import { FC } from "react";
import Tag from "./Tag";

interface TagSelectorProps {
    selectedTags: string[];
    addTag: (tag: string) => void;
    removeTag: (tag: string) => void;
}

const TagSelector: FC<TagSelectorProps> = ({ selectedTags, addTag, removeTag, ...props }) => {
    return (
        <div {...props} className="flex flex-wrap">
            {tags.map((tag: string) => (
                <div key={tag} className="p-1">
                    {selectedTags.includes(tag) ? (
                        <button
                            onClick={() => {
                                removeTag(tag)
                            }}
                        >
                            <Tag title={tag} selected={true} />
                        </button>
                    ) : (
                        <button
                            onClick={() =>
                                addTag(tag)
                            }
                        >
                            <Tag title={tag} selected={false} />
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};
export default TagSelector;
