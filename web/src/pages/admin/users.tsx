import React, {
    memo,
    useCallback,
    useEffect,
    useMemo,
    useState,
    FC,
} from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import Alert from "../../components/Alert";
import UserRankBadge from "../../components/UserRankBade";
import { GoTriangleUp, GoTriangleDown } from "react-icons/go";
import Loader from "../../components/Loader";
import Modal from "react-modal";
const Permissions = () => {
    interface User {
        id: string;
        username: string;
        discriminator: string;
        rank: number;
        avatar: string;
    }

    const [userData, setUserData] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [authorized, setAuthorized] = useState<boolean>(true);

    const [modalIsOpen, setIsOpen] = useState<boolean>(false);
    // Close and open the modals
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    const [currentUserId, setCurrentUserId] = useState<string>();
    const [currentUserRank, setCurrentUserRank] = useState<number>();
    const [currentUserIndex, setCurrentUserIndex] = useState<number>();
    useEffect(() => {
        getUsers()
            //If the fetch got the data make the state a success
            .then((res) => {
                if (res.status === 401) setAuthorized(false);
                return res.json();
            })
            .then((res) => {
                setUserData(res);
                setLoading(false);
            })
            //If the fetch was bad set the state of the fecth to failed
            .catch(() => {
                setLoading(false);
                setError(true);
            });
    }, []);

    const getUsers = async () => await fetch("/api/user/all");

    const handleModify = useCallback(
        (id: string, rank: number) => {
            fetch(`/api/user/modify/${id}/${rank}`, {
                // Adding method type
                method: "POST",
                // Adding headers to the request
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST",
                    "Access-Control-Allow-Headers": "*",
                },
            })
                // .then(response => console.log(response.text()))
                .then((r) => r.json())
                .then((r) => toast(`${r.message}`));
        },
        [toast]
    );
    interface IncrementRankProps {
        currentRank: number;
        id: string;
        index: number;
    }
    const Increment: FC<IncrementRankProps> = ({ currentRank, id, index }) => {
        return (
            <>
                {currentRank > 4 ? null : (
                    <button
                        className="p-1 m-1 bg-green-400 rounded-md"
                        onClick={() => {
                            handleModify(id, currentRank + 1);
                            changeUserRankData(index, currentRank + 1);
                        }}
                    >
                        <GoTriangleUp />
                    </button>
                )}
                {currentRank < 1 ? null : (
                    <button
                        className="p-1 m-1 bg-red-400 rounded-md"
                        onClick={() => {
                            if (currentRank > 4) {
                                setCurrentUserId(id);
                                setCurrentUserRank(currentRank);
                                setCurrentUserIndex(index);
                                openModal();
                            } else {
                                handleModify(id, currentRank - 1);
                                changeUserRankData(index, currentRank - 1);
                            }
                        }}
                    >
                        <GoTriangleDown />
                    </button>
                )}
            </>
        );
    };
    const changeUserRankData = (index: number, rank: number) => {
        const usersCopy = [...userData];
        usersCopy[index].rank = rank;
        setUserData(usersCopy);
    };
    const UserTable = () => {
        if (error) {
            return (
                <Alert
                    type="error"
                    message="Looks like we can not reach the API."
                />
            );
        }
        if (loading) {
            return <Loader />;
        } else {
            return (
                <>
                    {useMemo(
                        () =>
                            userData.map(
                                (
                                    {
                                        id,
                                        username,
                                        discriminator,
                                        rank,
                                        avatar,
                                    }: User,
                                    index
                                ) => (
                                    <tr
                                        key={id}
                                        className={`border-b p-5 ${
                                            index % 2 === 0
                                                ? "bg-gray-100"
                                                : null
                                        }`}
                                    >
                                        <td className="text-left p-3">
                                            <Link href={`/user/${id}`}>
                                                <img
                                                    className="rounded-full border-1"
                                                    src={`https://cdn.discordapp.com/avatars/${id}/${avatar}.png?size=40`}
                                                    alt={
                                                        "cannot find profile image"
                                                    }
                                                />
                                            </Link>
                                        </td>
                                        <td className="text-left p-3 text-sm">
                                            <code>
                                                <Link
                                                    href={`/user/${id}`}
                                                >{`${username}#${discriminator}`}</Link>
                                            </code>
                                        </td>
                                        <td className="text-left p-3 text-sm">
                                            {id}
                                        </td>
                                        <td className="text-left p-3">
                                            <UserRankBadge rank={rank} />
                                        </td>
                                        <td className="text-left p-3">
                                            <Increment
                                                currentRank={rank}
                                                id={id}
                                                index={index}
                                            />
                                        </td>
                                    </tr>
                                )
                            ),
                        [userData]
                    )}
                </>
            );
        }
    };

    if (error) {
        return <Alert type="error" message="Could not find user data" />;
    }
    if (!authorized) {
        return (
            <Alert
                type="error"
                message="Sorry you are not allowed to access this part of the website!"
            />
        );
    } else if (loading) {
        return <Loader />;
    } else {
        return (
            <div>
                <table className="table-fixed w-full">
                    <thead>
                        <tr className="justify-between border-b">
                            <th scope="col" className="px-5 text-left" />
                            <th scope="col" className="px-5 text-left">
                                Username
                            </th>
                            <th scope="col" className="px-5 text-left">
                                Discord ID
                            </th>
                            <th scope="col" className="px-5 text-left">
                                Rank
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <UserTable />
                    </tbody>
                </table>
                {userData &&
                currentUserId &&
                // Since 0 is false in js we need to test if the value is there or if it is just 0, but if it is undefined it wont pass.
                (currentUserIndex || currentUserIndex === 0) &&
                currentUserRank ? (
                    <Modal
                        isOpen={modalIsOpen}
                        shouldCloseOnEsc
                        onRequestClose={closeModal}
                        contentLabel="Example Modal"
                        className="inset-1/3 absolute bg-gray-50 rounded-xl p-10 border-2 border-green-500 shadow-lg"
                        overlayClassName="bg-gray-100 bg-opacity-50 inset-0 fixed"
                    >
                        <>
                            <h1 className="text-2xl mb-2">
                                Are you sure you want to demote{" "}
                                <strong>
                                    {userData[currentUserIndex].username}
                                </strong>
                                ?
                            </h1>
                            <p className="text-sm">
                                Please confirm since this action may affect your
                                ability to change this page if you are demoting
                                yourself.
                            </p>

                            <button
                                onClick={() => closeModal()}
                                className="appearance-none mt-5 bg-yellow-500 bg-opacity-25 rounded mb-2 py-2 px-4 text-yellow-900 leading-tight mr-3"
                            >
                                Cancel
                            </button>
                            <button
                                className="appearance-none bg-red-500 bg-opacity-25 rounded mb-2 py-2 px-4 text-red-700 leading-tight"
                                onClick={() => {
                                    handleModify(
                                        currentUserId,
                                        currentUserRank - 1
                                    );
                                    changeUserRankData(
                                        currentUserIndex,
                                        currentUserRank - 1
                                    );
                                    closeModal();
                                }}
                            >
                                Confirm
                            </button>
                        </>
                    </Modal>
                ) : null}
            </div>
        );
    }
};
export default memo(Permissions);
