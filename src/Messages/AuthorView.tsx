import { TagView } from "./TagView";
import { MessageUser, Message } from "../ProtocolInterfaces"
import { AppContext } from "../Contexts/AppContext";
import { useContext } from "react";

interface AuthorViewProps {
    message: Message;
}

function getFinalName(message: Message) {
    if (message.customAuthorName.length !== 0) {
        return message.customAuthorName;
    }

    const author = message.author;
    if (!author) {
        return "NULL_AUTHOR";
    }

    return author.name;
}

function getFinalAvatar(message: Message, blankAvatar: string) {
    if (message.customAuthorAvatarUrl.length !== 0) {
        return message.customAuthorAvatarUrl;
    }

    const author = message.author;
    if (!author) {
        return "";
    }

    const avatar = author.avatar;
    if (avatar.length !== 0) {
        return avatar;
    }

    return blankAvatar;
}

export function AuthorView({message} : AuthorViewProps) {
    const appContext = useContext(AppContext);
    const author = message.author;

    if (!author) {
        return <span className="null_author">NULL_AUTHOR</span>;
    }

    const showPlatformIcon = appContext.settings.widgets.messages.showPlatformIcon;
    const showAvatars = appContext.settings.widgets.messages.showAvatar;

    function clicked() {
        appContext.ws?.sendJsonMessage({
            type: "SHOW_USER_INFO_REQUESTED",
            data: {
                userId: author.id,
            }
        });
    }

    let avatarClassNames = "avatar"

    if (!author.preventCropAvatar) {
        avatarClassNames += " roundImage"
    }

    return (
        <span className="author on-hover-cursor-pointer"
            onClick={clicked}
        >
            {showPlatformIcon &&
                <span className="badges">
                    <img
                        className="badgeServiceIcon"
                        alt=""
                        src={author.serviceBadge}
                    />
                </span>}

            {showAvatars &&
                <img
                    className={avatarClassNames}
                    alt=""
                    src={getFinalAvatar(message, appContext.settings.chat.blankAvatar)}
                    height={32}
                    width={32}
                />}


            <span className="tags">
                {author.leftTags.map((tag, idx) => (
                    <TagView key={idx} tag={tag}/>
                ))}
            </span>

            <span className="badges">
                {author.leftBadges.map((badgeUrl, idx) => (
                    <img key={idx} className="badgeLeft" alt="" src={badgeUrl}></img>
                ))}
            </span>

            <span
                className={"authorName" + (author.customBackgroundColor.length  > 0 ? " authorNameCustomBackgroundColor" : "")}
                style={{
                    "color": author.color,
                    "backgroundColor": author.customBackgroundColor,
                }}>
                {getFinalName(message)}
            </span>

            <span className="badges">
                {author.rightBadges.map((badgeUrl, idx) => (
                    <img key={idx} className="badgeRight" alt="" src={badgeUrl}></img>
                ))}
            </span>

            <span className="tags">
                {author.rightTags.map((tag, idx) => (
                    <TagView key={idx} tag={tag}/>
                ))}
            </span>
        </span>
    )
}
