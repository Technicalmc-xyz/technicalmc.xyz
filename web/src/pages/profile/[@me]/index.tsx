import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { User } from "../../../types";
import Alert from "../../../components/Alert";
import UserRankBadge from "../../../components/UserRankBade";
import Loader from "../../../components/Loader";

const Profile = () => {
    const [user, setUser] = useState<User>();
    const [authenticated, setAuthenticated] = useState<boolean>(true);
    const [banned, setBanned] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        getUser()
            .then((res) => {
                if (res.status === 401) setAuthenticated(false);
                if (res.status === 403) setBanned(true);
                return res.json();
            })
            .then((res) => {
                setUser(res);
                setLoading(false);
            })

            .catch((e) => console.log(e));
    }, []);
    const getUser = async () => fetch("/api/user/@me");

    if (loading) {
        <Loader />;
    }

    if (banned) {
        return (
            <Alert
                message="You have been banned from technicalmc.xyz"
                description="If you have any questions contact Jakku#6969"
                type="error"
            />
        );
    } else {
        return (
            <div className="p-5">
                {authenticated && user ? (
                    <div className="flex">
                        <img
                            src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`}
                            alt="TMW"
                            className="rounded-full shadow-md mr-5"
                        />
                        <div>
                            <h1 className="text-3xl">
                                {user.username}
                                <UserRankBadge rank={user.rank} />
                            </h1>
                            <i className="font-thin text-xs">{user.id}</i>
                            <h5 className="font-semibold">
                                #{user.discriminator}
                            </h5>
                        </div>
                    </div>
                ) : (
                    <Alert
                        type="error"
                        message="You are not authenticated"
                        description="Please login to become authenticated"
                    />
                )}
            </div>
        );
    }
};

export default Profile;
