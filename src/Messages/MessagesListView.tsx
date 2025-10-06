import { useCallback, useContext, useEffect, useState } from "react";
import { AnimatedDummyTextView } from "../AnimatedDummyTextView";
import { MessageView } from "./MessageView";
import { Message } from "../ProtocolInterfaces";
import { AppContext } from "../Contexts/AppContext";
import { FloatButton } from 'antd';
import { ArrowDownOutlined } from "@ant-design/icons";

interface MessagesListViewProps {
    messages: Message[];
    hideTimeout: number;
}

export function MessagesListView({messages, hideTimeout}: MessagesListViewProps) {
    const appContext = useContext(AppContext);
    const hideConnectionStatusWhenConnected = appContext.settings.widgets.hideConnectionStatusWhenConnected;
    const [lastElement, setLastElement] = useState<HTMLDivElement | null>();
    const [autoscrollEnabled, setAutoscrollEnabled] = useState<boolean>(false);
    const scrollToBottom = useCallback(() => {
        setAutoscrollEnabled(true);
        if (lastElement) {
            lastElement.scrollIntoView({ behavior: "smooth" });
        }
    }, [lastElement]);

    useEffect(() => {
        if (autoscrollEnabled) {
            scrollToBottom();
        }
    }, [lastElement, messages, autoscrollEnabled, scrollToBottom]);


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

            <div
                style={{ float: "left", clear: "both" }}
                ref={(element) => {
                    setLastElement(element);
                }}
            />
            {!autoscrollEnabled && 
                <FloatButton onClick={scrollToBottom} icon={<ArrowDownOutlined />} type="primary" style={{ insetInlineEnd: "50%" }} />
            }
        </div>
    );
}
