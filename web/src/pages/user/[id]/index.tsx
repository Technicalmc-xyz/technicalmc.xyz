import React from "react";
import { User } from "../../../types";
import { ParsedUrlQuery } from "querystring";
import { GetServerSideProps, NextPage } from "next";
import Alert from "../../../components/Alert";
import UserRankBadge from "../../../components/UserRankBade";

const getTitle = (params?: ParsedUrlQuery) => {
    if (!params?.id) {
        return null;
    }
    const { id } = params;
    return Array.isArray(id) ? id[0] : id;
};

export const getServerSideProps: GetServerSideProps = async ({
    params,
    res,
}) => {
    const id = getTitle(params);
    if (!id) {
        return {
            notFound: true,
        };
    }
    const result = await fetch(`http://localhost:3000/api/user/${id}`);
    if (!result.ok) {
        res.statusCode = result.status;
        return { props: {} };
    }
    const user: User = await result.json();
    return { props: { user } };
};

const Profile: NextPage<{ user: User }> = (props) => {
    if (!props.user) {
        return (
            <Alert
                type="error"
                message="Cannot find user"
                description="Is the user id correct?"
            />
        );
    }
    return (
        <div className="p-5">
            <div className="flex">
                <img
                    src={`https://cdn.discordapp.com/avatars/${props.user.id}/${props.user.avatar}`}
                    alt="TMW"
                    className="rounded-full shadow-md mr-5"
                />
                <div>
                    <h1 className="text-3xl">
                        {props.user.username}
                        <UserRankBadge rank={props.user.rank} />
                    </h1>
                    <i className="font-thin text-xs">{props.user.id}</i>
                    <h5 className="font-semibold">
                        #{props.user.discriminator}
                    </h5>
                </div>
            </div>
        </div>
    );
};

export default Profile;
