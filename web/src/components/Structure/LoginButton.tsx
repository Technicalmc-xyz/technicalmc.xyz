import { FC } from "react";
import { User } from "../../types";
import { FiLogIn } from "react-icons/fi";

export interface LoginButtonProps {
    authenticated: boolean;
    user: User;
    avatar?: string;
    userid?: string;
}

const LoginButton: FC<LoginButtonProps> = ({
    authenticated,
    user,
    avatar,
    userid,
    ...props
}) => {
    if (authenticated && user) {
        return (
            <div className="flex ml-auto" {...props}>
                <a href={"/profile/@me"} className="flex flex-row items-center">
                    <img
                        src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`}
                        alt="Could not find user profile picture"
                        className="h-10 w-10 bg-gray-200 border rounded-full"
                    />
                    <span className="flex flex-col ml-2">
                        <span className="truncate w-20 font-semibold tracking-wide leading-none">
                            {user.username}
                        </span>
                        <span className="truncate w-20 text-gray-500 text-xs leading-none mt-1">
                            #{user.discriminator}
                        </span>
                    </span>
                </a>
            </div>
        );
    }

    return (
        <div className="flex ml-auto" {...props}>
            <a href="/api/auth/login">
                <FiLogIn size={20} />
            </a>
        </div>
    );
};
export default LoginButton;