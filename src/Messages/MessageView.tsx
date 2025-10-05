import React, { useState } from 'react';
import { ContentView } from "./ContentView"
import { AuthorView } from "./AuthorView";
import { TimeView } from "./TimeView";
import { Message } from "./Interfaces";
import CSS from "csstype";

function isMessageAuthorVisible(message: Message) {
    if (message.markedAsDeleted || message.deletedOnPlatform) {
        return false;
    }

    return true;
}

function getAuthorContent(message: Message, showPlatformIcon: boolean) {
    if (!isMessageAuthorVisible(message)) {
        return <></>
    }

    return (<>
        <AuthorView author={message.author} showPlatformIcon={showPlatformIcon}/>

        {message.multiline ?
            (
                <br/>
            ) :
            (
                <span className="authorMessageContentSeparator"></span>
            )
        }
    </>)
}

function getMessageStyle(message: Message) : object {
    if (!message) {
        return {};
    }

    const forcedColors = message.forcedColors;

    let r : CSS.Properties = {};

    if (forcedColors.bodyBackground) {
        r.backgroundColor = forcedColors.bodyBackground
    }

    if (forcedColors.bodyBorder) {
        r.borderWidth = "2px";
        r.borderStyle = "solid";
        r.borderColor = forcedColors.bodyBorder;
    }

    return r
}

interface MessageViewProps {
    message: Message;
    hideTimeout: number;
    messageStyle: object;
    showPlatformIcon: boolean;
}

export function MessageView({ message, hideTimeout, messageStyle, showPlatformIcon }: MessageViewProps) {
    const [needToHide, setNeedToHide] = useState<boolean>(false);

    if (hideTimeout > 0) {
        setTimeout(() => {
            setNeedToHide(true);
        }, hideTimeout)
    }

    if (!message) {
        return <span className="null_message">NULL_MESSAGE</span>;
    }

    const style = {
        ...messageStyle,
        ...getMessageStyle(message),
    }

    return (
        <span
            className={"message" + (needToHide ? " hiddenFadeOut" : "")}
            style={style}>
            
            <TimeView timeIso={message.publishedAt}/>

            {getAuthorContent(message, showPlatformIcon)}

            <span className="messageContents">
                {message.contents.map((content, idx) => (
                    <ContentView key={idx} content={content} />
                ))}
            </span>
        </span>
    );
}
