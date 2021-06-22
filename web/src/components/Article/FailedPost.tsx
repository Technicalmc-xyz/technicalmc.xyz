import { FC } from "react";
import Alert from "../Alert";

export interface FailedPostProps {
    message: string;
    failed: boolean;
}

export const FailedPost: FC<FailedPostProps> = ({
    message,
    failed,
    ...props
}) => {
    if (failed) {
        return <Alert type="error" message={message} {...props} />;
    } else {
        return null;
    }
};
