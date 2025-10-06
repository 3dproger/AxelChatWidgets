import { useContext, useEffect, useState } from "react";
import { AnimatedDummyTextView } from "../AnimatedDummyTextView";
import { MessageView } from "./MessageView";
import { Message } from "../ProtocolInterfaces";
import { AppContext } from "../Contexts/AppContext";

interface MessagesListViewProps {
    messages: Message[];
    hideTimeout: number;
}

export function MessagesListView({messages, hideTimeout}: MessagesListViewProps) {
    const appContext = useContext(AppContext);
    const hideConnectionStatusWhenConnected = appContext.settings.widgets.hideConnectionStatusWhenConnected;
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
                type="SUCCESS"
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
                    hideTimeout={hideTimeout}
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
