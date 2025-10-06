import { useContext } from "react";
import { AnimatedDummyTextView } from "../AnimatedDummyTextView";
import { MessageView } from "./MessageView";
import { Message } from "../ProtocolInterfaces";
import { AppContext } from "../Contexts/AppContext";
import { AutoscrollableContainer } from "../AutoscrollableContainer";

interface MessagesListViewProps {
    messages: Message[];
    hideTimeout: number;
}

export function MessagesListView({messages, hideTimeout}: MessagesListViewProps) {
    const appContext = useContext(AppContext);
    const hideConnectionStatusWhenConnected = appContext.settings.widgets.hideConnectionStatusWhenConnected;

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
            </div>
        </AutoscrollableContainer>
    );
}
