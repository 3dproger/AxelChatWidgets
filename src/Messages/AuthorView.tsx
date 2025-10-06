import { TagView } from "./TagView";
import { MessageUser } from "../ProtocolInterfaces"
import { AppContext } from "../Contexts/AppContext";
import { useContext } from "react";

interface AuthorViewProps {
    author: MessageUser;
}

export function AuthorView({author} : AuthorViewProps) {
    const appContext = useContext(AppContext);

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
                    className="avatar"
                    alt=""
                    src={author.avatar}
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
                {author.name}
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
