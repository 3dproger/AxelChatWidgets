import React, { useState, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useSearchParams } from 'react-router-dom';
import { MessagesListView } from './MessagesListView';
import { MessagesWidgetEditorView } from './MessagesWidgetEditorView'
import { ServicesListView } from './ServicesListView'
import { AnimatedDummyTextView } from './AnimatedDummyTextView'
import packageJson from '../package.json';

const WEBSOCKET_CLIENT_TYPE = "WEB_WIDGET";

export const CoreView = () => {
    const [searchParams] = useSearchParams();
    const [authors, setAuthors] = useState(new Map());
    const [messages, setMessages] = useState([]);
    const [services, setServices] = useState([]);
    const [appState, setState] = useState({
        viewers: -1,
    });
    const { sendMessage, lastMessage, readyState } = useWebSocket('ws://localhost:8355', {
        onOpen: () => {
            console.log('Opened socket')
            sendMessage(JSON.stringify({
                type: "HELLO",
                data: {
                    client: {
                        type: WEBSOCKET_CLIENT_TYPE,
                    },
                    package: {
                        version: packageJson.version,
                        name: packageJson.name,
                    },
                    widget: {
                        type: searchParams.get("widget"),
                    },
                },
            }));
        },
        shouldReconnect: (closeEvent) => true,
    });

    useEffect(() => {
        if (!lastMessage) {
            return;
        }

        const protocolMessage = JSON.parse(lastMessage.data);
        //console.log(protocolMessage);
        const protocolMessageType = protocolMessage.type;
        const data = protocolMessage.data;

        if (protocolMessageType === "state") {
            setServices(data.services);
            setState(data);
        }
        else if (protocolMessageType === "messages") {
            setMessages((prev) => {
                prev = prev.concat(...data.messages);

                for (const message of data.messages) {
                    const author = message.author;
                    authors.set(author.id, author);
                }

                const MaxMessagesCount = 50;

                if (prev.length > MaxMessagesCount) {
                    prev = prev.slice(prev.length - MaxMessagesCount, prev.length);
                }

                return prev;
            });
        }
        else if (protocolMessageType === "author_values") {
            const authorId = data.author_id;

            if (authors.has(authorId)) {
                var author = authors.get(authorId);
                for (var key in data.values) {
                    author[key] = data.values[key];
                }
            }
        }
        else if (protocolMessageType === "HELLO") {
            // ignore
        }
        else {
            console.error("Unknown message type '" + protocolMessageType + "', protocol message = '" + protocolMessage + "'");
        }

    }, [lastMessage, setMessages]);
    
    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting...',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    if (readyState == ReadyState.OPEN) {
        const widgetType = searchParams.get("widget");

        if (widgetType === "messages") {
            return (<MessagesListView messages={messages} />);
        }
        else if (widgetType === "messages-widget-editor") {
            return (<MessagesWidgetEditorView messages={messages} />);
        }
        else if (widgetType === "states") {
            return (<ServicesListView services={services} appState={appState} />);
        }
        else {
            return (<span className="errorText">Error: unknown widget</span>);
        }
    }
    else {
        return (
            <AnimatedDummyTextView text={connectionStatus} imageSrc="./images/error-alt-svgrepo-com.svg"/>
        )
    }
};

export default CoreView;