import { useSearchParams } from "react-router-dom";
import packageJson from '../package.json';
import {
    osName,
    osVersion,
    browserName,
    isBrowser,
    fullBrowserVersion,
    isDesktop,
    isMobileOnly,
    isTablet,
    isSmartTV,
    isMobile,
    isConsole,
    isWearable,
    isEmbedded,
    mobileVendor,
    mobileModel,
} from 'react-device-detect'
import { AppContext, HostAppState, parseSearchParams } from "./Contexts/AppContext";
import { useCallback, useContext, useEffect, useReducer, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { Message, GenericMessagesMessageData, ProtocolMessage } from "./ProtocolInterfaces";
import { MessagesListView } from "./Messages/MessagesListView";
import { PlatformStateListView } from "./States/PlatformStateListView";
import { AnimatedDummyTextView, IndicatorType } from "./AnimatedDummyTextView";

function getDeviceType() {
    if (isDesktop) { return "DESKTOP" }
    if (isMobileOnly) {return "MOBILE" }
    if (isTablet) { return "TABLET" }
    if (isSmartTV) { return "SMART_TV" }
    if (isConsole) { return "CONSOLE" }
    if (isWearable) { return "WEARABLE" }
    if (isEmbedded) { return "EMBEDDED" }
    return "UNKNOWN"
}

function getDeviceName() {
    if (isMobile) {
        return mobileVendor + ", " + mobileModel
    }

    return ""
}

export function RootView() {
    const [searchParamsRaw] = useSearchParams();
    const appContext = useContext(AppContext);
    parseSearchParams(searchParamsRaw, appContext.searchParams);

    const [authorsMap] = useState(new Map());
    const [messages, setMessages] = useState<Message[]>([]);
    const [messagesMap, setMessagesMap] = useState(new Map<string, Message>());
    const [selectedMessages, setSelectedMessages] = useState<Message[]>([]);

    // https://stackoverflow.com/questions/57883814/forceupdate-with-react-hooks
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const { sendMessage, lastMessage, readyState } = useWebSocket(appContext.searchParams.wsUrl, {
    onOpen: () => {
        if (appContext.searchParams.eventsLogging) {
            console.log('Opened socket');
        }

        setMessages([]);
        sendMessage(JSON.stringify({
            type: "HELLO",
            data: {
                client: {
                    type: "MAIN_WEBSOCKETCLIENT",
                    name: packageJson.name,
                    version: packageJson.version,
                    device: {
                        type: getDeviceType(),
                        name: getDeviceName(),
                        os: {
                            name: osName,
                            version: osVersion,
                        },
                        browser: {
                            name: browserName,
                            version: fullBrowserVersion,
                        },
                    }
                },
                info: {
                    type: "WIDGET",
                    name: appContext.searchParams.widget,
                },
            },
        }));},
        shouldReconnect: (closeEvent) => true,
    });

    function removeMessages(ids: string[]) {
        for (const i in ids) {
            const id = ids[i];
            messagesMap.delete(id);
            setMessages((prev) => {
                return prev.filter(message => (message.id !== id));
            });
        }
    }

    useEffect(() => {
        if (!lastMessage) {
            return;
        }

        const protocolMessage = JSON.parse(lastMessage.data) as ProtocolMessage;
        const protocolMessageType = protocolMessage.type;
        const data = protocolMessage.data;

        if (appContext.searchParams.eventsLogging) {
            if (protocolMessageType !== "PING" && protocolMessageType !== "PONG") {
                console.log(protocolMessage);
            }
        }

        if (protocolMessageType === "NEW_MESSAGES_RECEIVED") {
            setMessages((prev) => {
                const specData = data as GenericMessagesMessageData;

                prev = prev.concat(...specData.messages);

                for (const message of specData.messages) {
                    messagesMap.set(message.id, message)
                    const author = message.author;
                    authorsMap.set(author.id, author);
                }

                const MaxMessagesCount = 70;

                if (prev.length > MaxMessagesCount) {
                    const needToDeleteCount = prev.length - MaxMessagesCount;

                    for (let i = 0; i < needToDeleteCount; i++) {
                        const message = prev.shift();
                        if (message) {
                            messagesMap.delete(message.id);
                        }
                    }
                }

                return prev;
            });
        }
        else if (protocolMessageType === "STATES_CHANGED") {
            appContext.hostApp = data;
        }
        else if (protocolMessageType === "MESSAGES_CHANGED") {
            const specData = data as GenericMessagesMessageData;
            for (const message of specData.messages) {
                let prevMessage = messagesMap.get(message.id);
                if (prevMessage) {

                    if (appContext.searchParams.eventsLogging) {
                        console.log("changed ", prevMessage, " to ", message);
                    }

                    Object.assign(prevMessage, message);
                }
            }

            forceUpdate();
        }
        else if (protocolMessageType === "MESSAGES_REMOVED") {
            let ids: string[] = [];
            const specData = data as GenericMessagesMessageData;
            const messages = specData.messages;
            for (const i in messages) {
                const message = messages[i]
                ids.push(message.id);
            }
            removeMessages(ids);
        }
        else if (protocolMessageType === "MESSAGES_SELECTED") {
            setSelectedMessages((prev) => {
                const specData = data as GenericMessagesMessageData;
                for (const message of specData.messages) {
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
        else if (protocolMessageType === "NEED_RELOAD") {
            window.location.reload();
        }
        else if (protocolMessageType === "SETTINGS_UPDATED") {
            appContext.settings = data.settings;
        }
        else if (protocolMessageType === "CLEAR_MESSAGES") {
            setMessages((prev) => {
                messagesMap.clear();
                return [];
            });
        }
        else if (protocolMessageType === "HELLO" ||
                 protocolMessageType === "PONG" ||
                 protocolMessageType === "SERVER_CLOSE") {
            // ignore
        }
        else if (protocolMessageType === "PING") {
            sendMessage(JSON.stringify({
                type: "PONG"
            }));
        }
        else {
            console.error("Unknown message type '" + protocolMessageType + "', protocol message = '" + protocolMessage + "'");
        }

    }, [lastMessage, setMessages]);

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting...',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed. Please launch the AxelChat or refresh the widget...',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    if (readyState === ReadyState.OPEN) {
        const widgetType = appContext.searchParams.widget;

        if (widgetType === "messages") {
            return (<MessagesListView
                messages={messages}
                hideTimeout={appContext.settings.widgets.messages.hideTimeout}
                messageStyle={appContext.settings.widgets.messages.style}
                hideConnectionStatusWhenConnected={appContext.settings.widgets.hideConnectionStatusWhenConnected}
                showPlatformIcon={appContext.settings.widgets.messages.showPlatformIcon}
                />);
        }
        else if (widgetType === "selected-messages") {
            return (<MessagesListView
                messages={selectedMessages}
                hideTimeout={0}
                messageStyle={appContext.settings.widgets.messages.style}
                hideConnectionStatusWhenConnected={appContext.settings.widgets.hideConnectionStatusWhenConnected}
                showPlatformIcon={appContext.settings.widgets.messages.showPlatformIcon}
                />);
        }
        else if (widgetType === "states") {
            return (<PlatformStateListView
                hidePlatformIconIfCountIsUnknown={appContext.settings.widgets.states.hidePlatformIconIfCountIsUnknown} />);
        }
        else {
            let text: string;
            if (appContext.searchParams.widget.length === 0) {
                text = "Widget parameter not specified";
            }
            else {
                text = "Unknown widget '" + appContext.searchParams.widget + "'";
            }

            return (<span className="errorText">Error: {text}</span>);
        }
    }
    else {
        return (
            <AnimatedDummyTextView
                type={readyState === ReadyState.CONNECTING ? IndicatorType.Loading : IndicatorType.Critical}
                text={connectionStatus}/>
        )
    }
}