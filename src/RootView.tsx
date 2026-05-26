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
import { Message, GenericMessagesMessageData, ProtocolMessage, UserUpdatedData } from "./ProtocolInterfaces";
import { MessagesListView } from "./Messages/MessagesListView";
import { PlatformStateListView } from "./States/PlatformStateListView";
import { AnimatedDummyTextView } from "./AnimatedDummyTextView";

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

function getMessageById(list: Message[], id : string) : Message | undefined {
    for (const message of list) {
        if (message.id === id) {
            return message;
        }
    }

    return undefined;
}

function updateMessage(list: Message[], newMessage : Message) {
    let prevMessage = getMessageById(list, newMessage.id);
    if (!prevMessage) {
        return;
    }

    Object.assign(prevMessage, newMessage);
}

export function RootView() {
    const [searchParamsRaw] = useSearchParams();
    const appContext = useContext(AppContext);
    parseSearchParams(searchParamsRaw, appContext.searchParams);

    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedMessages, setSelectedMessages] = useState<Message[]>([]);

    // https://stackoverflow.com/questions/57883814/forceupdate-with-react-hooks
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    appContext.ws = useWebSocket(appContext.searchParams.wsUrl, {
    onOpen: () => {
        if (appContext.searchParams.eventsLogging) {
            console.log('Opened socket');
        }

        setMessages([]);
        appContext.ws?.sendMessage(JSON.stringify({
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

    const { sendMessage, lastMessage, readyState } = appContext.ws;

    function removeMessages(ids: string[]) {
        for (const i in ids) {
            const id = ids[i];
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
        const rawData = protocolMessage.data;

        if (appContext.searchParams.eventsLogging) {
            if (protocolMessageType !== "PING" && protocolMessageType !== "PONG") {
                console.log(protocolMessage);
            }
        }

        if (protocolMessageType === "NEW_MESSAGES_RECEIVED") {
            setMessages((prev) => {
                const specData = rawData as GenericMessagesMessageData;

                prev = prev.concat(...specData.messages);

                const MaxMessagesCount = 70;

                if (prev.length > MaxMessagesCount) {
                    const needToDeleteCount = prev.length - MaxMessagesCount;

                    for (let i = 0; i < needToDeleteCount; i++) {
                        prev.shift();
                    }
                }

                return prev;
            });
        }
        else if (protocolMessageType === "STATES_CHANGED") {
            appContext.hostApp = rawData;
        }
        else if (protocolMessageType === "MESSAGES_CHANGED") {
            const specData = rawData as GenericMessagesMessageData;
            for (const newMessage of specData.messages) {
                updateMessage(messages, newMessage);
                updateMessage(selectedMessages, newMessage);
            }

            forceUpdate();
        }
        else if (protocolMessageType === "MESSAGES_REMOVED") {
            let ids: string[] = [];
            const specData = rawData as GenericMessagesMessageData;
            const messages = specData.messages;
            for (const i in messages) {
                const message = messages[i]
                ids.push(message.id);
            }
            removeMessages(ids);
        }
        else if (protocolMessageType === "MESSAGES_SELECTED") {
            setSelectedMessages((prev) => {
                return (rawData as GenericMessagesMessageData).messages;
            });
        }
        else if (protocolMessageType === "USER_UPDATED") {
            setMessages((prev) => {
                const newUser = (rawData as UserUpdatedData).user;

                for (let message of prev) {
                    if (message.author.id === newUser.id) {
                        //message.author = newUser;
                        Object.assign(message.author, newUser);
                        break;
                    }        
                }

                return prev;
            });
        }
        else if (protocolMessageType === "NEED_RELOAD") {
            window.location.reload();
        }
        else if (protocolMessageType === "SETTINGS_UPDATED") {
            appContext.settings = rawData.settings;
        }
        else if (protocolMessageType === "CLEAR_MESSAGES") {
            setMessages((prev) => {
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
                />);
        }
        else if (widgetType === "selected-messages") {
            return (<MessagesListView
                messages={selectedMessages}
                customHideTimeout={0}
                />);
        }
        else if (widgetType === "states") {
            return (<PlatformStateListView/>);
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
                type={readyState === ReadyState.CONNECTING ? "LOADING" : "CRITICAL"}
                text={connectionStatus}/>
        )
    }
}