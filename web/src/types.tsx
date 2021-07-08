export interface Article {
    urn_title: string;
    title: string;
    id: number;
    tags: string[];
    last_edited: number;
    edit_count: number;
    description: string;
    publicized: boolean;
    featured: boolean;
    status: boolean;
}

export type ArticleResponse = {
    id: number;
    urn_title: string;
    title: string;
    tags: string[];
    description: string;
    last_edited: string;
    edit_count: number;
    publicized: boolean;
    featured: boolean;
    body: any[] | undefined
};

export interface User {
    id: string;
    username: string;
    discriminator: string;
    avatar: string;
    rank: number;
}

export const tags: string[] = [
    "Block Resource",
    "Block Farming",
    "Mob Resource",
    "Agriculture",
    "Animal Husbandry",
    "World Manipulation",
    "World Transportation",
    "Traffic",
    "Resource Management and Processing",
    "Duplicate",
    "Game Mechanic",
    "Community",
    "Guides",
];

export const Ranks: { [key: number]: string } = {
    0: "Banned" as const,
    1: "Guest" as const,
    2: "Editor" as const,
    3: "Trusted" as const,
    4: "Developer" as const,
    5: "Moderator" as const,
};

export type Ranks = typeof Ranks;

export const RankBadgeColors: { [key: number]: string } = {
    0: "gray" as const,
    1: "gray" as const,
    2: "green" as const,
    3: "yellow" as const,
    4: "purple" as const,
    5: "pink" as const,
};

export type RankBadgeColors = typeof RankBadgeColors;

export const contextClass = {
    success: "bg-blue-300",
    error: "bg-red-300",
    info: "bg-gray-300",
    warning: "bg-orange-400",
    default: "bg-indigo-300",
    dark: "bg-white-600 font-gray-300",
};

export type alertType = "sucess" | "error" | "warning" | "info" | string;
