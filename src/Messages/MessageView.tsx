import React, { useContext, useEffect, useState } from 'react';
import { ContentView } from "./ContentView"
import { AuthorView } from "./AuthorView";
import { TimeView } from "./TimeView";
import { Message } from "../ProtocolInterfaces";
import CSS from "csstype";
import { AppContext } from '../Contexts/AppContext';

function isMessageAuthorVisible(message: Message) {
    if (message.markedAsDeleted || message.deletedOnPlatform) {
        return false;
    }

    return true;
}

function getAuthorContent(message: Message) {
    if (!isMessageAuthorVisible(message)) {
        return <></>
    }

    return (<>
        <AuthorView author={message.author}/>

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

function getMessageExtraStyle(message: Message) : object {
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
}

export function MessageView({ message, hideTimeout }: MessageViewProps) {
    const appContext = useContext(AppContext);
    const messageStyle = appContext.settings.widgets.messages.style;
    const [needToHide, setNeedToHide] = useState<boolean>(false);

    useEffect(() => {
        if (hideTimeout > 0) {
            const timer = setTimeout(() => {
                setNeedToHide(true);
            }, hideTimeout);

            return () => clearTimeout(timer);
        }
    }, [hideTimeout]);

    if (!message) {
        return <span className="null_message">NULL_MESSAGE</span>;
    }

    const style = {
        ...messageStyle,
        ...getMessageExtraStyle(message),
    }

    let className = "message";
    
    if (needToHide) {
        className += " fade-out";
    }
    else {
        className += " fade-in";
    }

    return (
        <span
            className={className}
            style={style}>
            
            <TimeView timeIso={message.publishedAt}/>

            {getAuthorContent(message)}

            <span className="messageContents">
                {message.contents.map((content, idx) => (
                    <ContentView key={idx} content={content} />
                ))}
            </span>
        </span>
    );
}
