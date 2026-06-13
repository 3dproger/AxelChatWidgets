import { useContext } from "react";
import { AnimatedDummyTextView } from "../AnimatedDummyTextView";
import { MessageView } from "./MessageView";
import { Message } from "../ProtocolInterfaces";
import { AppContext } from "../Contexts/AppContext";
import { AutoscrollableContainer } from "../AutoscrollableContainer";

interface MessagesListViewProps {
    messages: Message[];
    customHideTimeout?: number; // 0 => disable timeout
}

export function MessagesListView({messages, customHideTimeout}: MessagesListViewProps) {
    const appContext = useContext(AppContext);
    const hideConnectionStatusWhenConnected = appContext.settings.widgets.hideConnectionStatusWhenConnected;
    const hideTimeout = customHideTimeout ?? appContext.settings.widgets.messages.hideTimeout;

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
        <AutoscrollableContainer>
            <div className="messagesListView"
                onScroll={(event) => { console.log(event) }}>

                {messages.map((message) => (message.visible.public && (
                    <div
                        style={{ display: "flex", justifyContent: "space-between" }}
                        key={message.id}
                    >
                    <MessageView
                        message={message}
                        hideTimeout={hideTimeout}
                    />
                    </div>
                )))}
            </div>
        </AutoscrollableContainer>
    );
}
