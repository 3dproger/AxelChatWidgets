import React, { useState, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useSearchParams } from 'react-router-dom';
import { MessagesListView } from './MessagesListView';
import { ServicesListView } from './ServicesListView'
import { AnimatedDummyTextView, IndicatorType } from './AnimatedDummyTextView'
import packageJson from '../package.json';

export const CoreView = () => {
    const [searchParams] = useSearchParams();
    const [authors, setAuthors] = useState(new Map());
    const [messages, setMessages] = useState([]);
    const [selectedMessages, setSelectedMessages] = useState([]);
    const [services, setServices] = useState([]);
    const [appState, setState] = useState({
        viewers: -1,
    });
    const { sendMessage, lastMessage, readyState } = useWebSocket('ws://localhost:8355', {
        onOpen: () => {
            console.log('Opened socket');
            setMessages([]);
            sendMessage(JSON.stringify({
                type: "HELLO",
                data: {
                    client: {
                        type: "MAIN_WEBSOCKETCLIENT",
                        name: packageJson.name,
						version: packageJson.version,
                    },
                    info: {
						type: "WIDGET",
                        name: searchParams.get("widget"),
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

        if (protocolMessageType === "STATES_CHANGED") {
            setServices(data.services);
            setState(data);
        }
        else if (protocolMessageType === "NEW_MESSAGES_RECEIVED") {
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
        else if (protocolMessageType === "MESSAGES_SELECTED") {
            setSelectedMessages((prev) => {
                for (const message of data.messages) {
                    const author = message.author;
                    authors.set(author.id, author);
                }

                return data.messages;
            });
        }
        else if (protocolMessageType === "AUTHOR_VALUES_CHANGED") {
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
        [ReadyState.CLOSED]: 'Closed. Please launch the AxelChat or restart the widget...',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    if (readyState == ReadyState.OPEN) {
        const widgetType = searchParams.get("widget");

        if (widgetType === "messages") {
            return (<MessagesListView messages={messages} />);
        }
        else if (widgetType === "selected-messages") {
            return (<MessagesListView messages={selectedMessages} />);
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
            <AnimatedDummyTextView type={readyState == ReadyState.CONNECTING ? IndicatorType.Spin : IndicatorType.Image} text={connectionStatus} imageSrc="./images/error-alt-svgrepo-com.svg"/>
        )
    }
};

export default CoreView;