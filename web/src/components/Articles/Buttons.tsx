import React, { FC } from "react";
import { AiOutlineFire } from "react-icons/ai";
import { featureArticle, publicizeArticle } from "./Requests";
import { FiLock, FiUnlock, FiTrash } from "react-icons/fi";
import { useState } from "react";
import { toast } from "react-toastify";

export interface FeatureButtonProps {
    featured: boolean;
    title: string;
    id: number;
}

export const FeatureButton: FC<FeatureButtonProps> = ({
    id,
    featured,
    title,
}) => {
    const [isFeatured, setFeatured] = useState<boolean>(featured);
    return (
        <button
            className={`border-3 border-purple-900 rounded p-2 m-1 
            ${isFeatured ? "bg-purple-500" : "bg-purple-200"}
            ${isFeatured ? "hover:bg-purple-600" : "hover:bg-purple-300"}
            `}
            onClick={() => {
                featureArticle(id);
                setFeatured(!isFeatured);
                toast(`${isFeatured ? "Unfeatured" : "Featured"} ${title}`);
            }}
        >
            <AiOutlineFire color={"white"} size={20} />
        </button>
    );
};

export interface PublicizeButtonProps {
    id: number;
    publicArticle: boolean;
    title: string;
}

export const PublicizeButton: FC<PublicizeButtonProps> = ({
    id,
    publicArticle,
    title,
}) => {
    const [isPublic, setPublic] = useState<boolean>(publicArticle);
    return (
        <button
            className={`border-3 border-purple-900 rounded p-2 m-1 
            ${isPublic ? "bg-green-500" : "bg-yellow-500"}
            ${isPublic ? "hover:bg-green-600" : "hover:bg-yellow-600"}
            `}
            onClick={() => {
                publicizeArticle(id);
                setPublic(!isPublic);
                toast(`${isPublic ? "Privatized" : "Publicized"} ${title}`);
            }}
        >
            {isPublic ? (
                <FiUnlock color={"white"} />
            ) : (
                <FiLock color={"white"} />
            )}
        </button>
    );
};

export interface RemoveButtonProbs {
    id: number;
    title: string;
    remove: () => void;
}

export const RemoveButton: FC<RemoveButtonProbs> = ({
    id,
    title,
    remove,
    ...props
}) => (
    <button
        className="border-3 border-red-900 bg-red-500 rounded p-2 m-1 hover:bg-red-600"
        onClick={remove}
        {...props}
    >
        <FiTrash color={"white"} />
    </button>
);
