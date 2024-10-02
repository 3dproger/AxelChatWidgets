import React, { useState, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useSearchParams } from 'react-router-dom';
import { MessagesListView } from './MessagesListView';
import { ServicesListView } from './ServicesListView'
import { AnimatedDummyTextView, IndicatorType } from './AnimatedDummyTextView'
import packageJson from '../package.json';

export const CoreView = () => {
    const [searchParams] = useSearchParams();
    const [authorsMap] = useState(new Map());
    const [messages, setMessages] = useState([]);
    const [messagesMap, setMessagesMap] = useState(new Map());
    const [selectedMessages, setSelectedMessages] = useState([]);
    const [services, setServices] = useState([]);
    const [appState, setState] = useState({
        viewers: -1,
    });

    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);

    const { sendMessage, lastMessage, readyState } = useWebSocket('ws://localhost:8355', {
        onOpen: () => {
            //console.log('Opened socket');
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

        if (protocolMessageType === "NEW_MESSAGES_RECEIVED") {
            setMessages((prev) => {
                prev = prev.concat(...data.messages);

                for (const message of data.messages) {
                    messagesMap.set(message.id, message)
                    const author = message.author;
                    authorsMap.set(author.id, author);
                }

                const MaxMessagesCount = 50;

                if (prev.length > MaxMessagesCount) {
                    for (let i = prev.length - MaxMessagesCount; i < prev.length; i++) {
                        const message = prev[prev.length - 1];
                        messagesMap.delete(message.id);
                    }

                    prev = prev.slice(prev.length - MaxMessagesCount, prev.length);
                }

                return prev;
            });
        }
        else if (protocolMessageType === "STATES_CHANGED") {
            setServices(data.services);
            setState(data);
        }
        else if (protocolMessageType === "MESSAGES_CHANGED") {
            for (const message of data.messages) {
                let prevMessage = messagesMap.get(message.id);
                if (typeof(prevMessage) !== "undefined" && prevMessage !== null) {
                    Object.assign(prevMessage, message);
                }
            }
            forceUpdate();
        }
        else if (protocolMessageType === "MESSAGES_SELECTED") {
            setSelectedMessages((prev) => {
                for (const message of data.messages) {
                    const author = message.author;
                    authorsMap.set(author.id, author);
                }

                return data.messages;
            });
        }
        else if (protocolMessageType === "AUTHOR_VALUES_CHANGED") {
            const authorId = data.author_id;

            if (authorsMap.has(authorId)) {
                var author = authorsMap.get(authorId);
                for (var key in data.values) {
                    author[key] = data.values[key];
                }
            }
        }
        else if (protocolMessageType === "CLEAR_MESSAGES") {
            setMessages((prev) => {
                messagesMap.clear();
                return [];
            });
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

    if (readyState === ReadyState.OPEN) {
        const widgetType = searchParams.get("widget");

        if (widgetType === "messages") {
            return (<MessagesListView messages={messages} hideTimeout={0} />);
        }
        else if (widgetType === "selected-messages") {
            return (<MessagesListView messages={selectedMessages} hideTimeout={0} />);
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
            <AnimatedDummyTextView type={readyState === ReadyState.CONNECTING ? IndicatorType.Spin : IndicatorType.Image} text={connectionStatus} imageSrc="./images/error-alt-svgrepo-com.svg"/>
        )
    }
};

export default CoreView;