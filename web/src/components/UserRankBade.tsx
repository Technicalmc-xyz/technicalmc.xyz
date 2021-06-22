import { FC } from "react";
import { RankBadgeColors, Ranks } from "../types";
interface UserRankProps {
    rank: number;
}

const UserRankBadge: FC<UserRankProps> = ({ rank, ...props }) => {
    let color: string = RankBadgeColors[rank];

    return (
        <span
            className={`text-sm font-medium bg-${color}-300 py-1 px-2 font-bold rounded m-1`}
            {...props}
        >
            {Ranks[rank]}
        </span>
    );
};
export default UserRankBadge;
