import { useEffect, useState } from "react";
import { AnimatedDummyTextView } from "../AnimatedDummyTextView";
import { MessageView } from "./MessageView";
import { Message } from "../ProtocolInterfaces";
import CSS from "csstype";

interface MessagesListViewProps {
    messages: Message[];
    hideTimeout: number;
    hideConnectionStatusWhenConnected: boolean;
    messageStyle: CSS.Properties;
    showPlatformIcon: boolean;
}

export function MessagesListView({messages, hideTimeout, hideConnectionStatusWhenConnected, messageStyle, showPlatformIcon}: MessagesListViewProps) {
    const [lastElement, setLastElement] = useState<HTMLDivElement | null>();

    useEffect(() => {
        if (!lastElement) {
            return;
        }

        lastElement.scrollIntoView({ behavior: "smooth" });
    }, [lastElement, messages]);


    if (messages.length === 0) {
        if (hideConnectionStatusWhenConnected) {
            return (<></>)
        }

        return (
            <AnimatedDummyTextView
                type="Success"
                text="Connected!"
            />
        );
    }

    return (
        <div className="messagesListView">
            {messages.map((message) => (
                <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                    key={message.id}
                >
                <MessageView
                    message={message}
                    messageStyle={messageStyle}
                    hideTimeout={hideTimeout}
                    showPlatformIcon={showPlatformIcon}
                />
                </div>
            ))}

            <div
                style={{ float: "left", clear: "both" }}
                ref={(element) => {
                    setLastElement(element);
                }}
            />
        </div>
    );
}
