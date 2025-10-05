import React, { useState, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useSearchParams } from 'react-router-dom';
import { MessagesListView } from './Messages/MessagesListView';
import { ServicesListView } from './States/ServicesListView';
import { AnimatedDummyTextView, IndicatorType } from './AnimatedDummyTextView'
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
}
    from 'react-device-detect'

import packageJson from '../package.json';

function getWebSocketUrl(searchParams) {
    const param = searchParams.get("ws-url");
    if (typeof param === "string")
    {
        return param;
    }

    return "ws://" + window.location.hostname + ":" + window.location.port + "/";
}

function getEventLogging(searchParams) {
    const param = searchParams.get("event-logging");
    if (typeof param === "string")
    {
        return param.toLowerCase() === "true" ? true : false;
    }

    return false;
}

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

const getNavigatorLanguage = () => {
    if (navigator.languages && navigator.languages.length) {
      return navigator.languages[0];
    } else {
      return navigator.userLanguage || navigator.language || navigator.browserLanguage || 'en';
    }
  }

export const RootView = () => {
    const [searchParams] = useSearchParams();
    const [authorsMap] = useState(new Map());
    const [messages, setMessages] = useState([]);
    const [messagesMap, setMessagesMap] = useState(new Map());
    const [selectedMessages, setSelectedMessages] = useState([]);
    const [services, setServices] = useState([]);
    const [appState, setState] = useState({
        viewers: -1,
    });
    const [settings, setSettings] = useState({
        widgets: {
            messages: {
                hideTimeout: 0,
                style: {},
                showPlatformIcon: true,
            },
            states: {
                hidePlatformIconIfCountIsUnknown: false,
            },
            hideConnectionStatusWhenConnected: false,
        },
        locale: getNavigatorLanguage(),
    });
    const [config] = useState({
        eventsLogging: getEventLogging(searchParams)
    });

    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);

    const { sendMessage, lastMessage, readyState } = useWebSocket(getWebSocketUrl(searchParams), {
        onOpen: () => {
            if (config.eventsLogging) {
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
                        name: searchParams.get("widget"),
                    },
                },
            }));
        },
        shouldReconnect: (closeEvent) => true,
    });

    function removeMessages(ids) {
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

        const protocolMessage = JSON.parse(lastMessage.data);
        const protocolMessageType = protocolMessage.type;
        const data = protocolMessage.data;

        if (config.eventsLogging) {
            if (protocolMessageType !== "PING" && protocolMessageType !== "PONG") {
                console.log(protocolMessage);
            }
        }

        if (protocolMessageType === "NEW_MESSAGES_RECEIVED") {
            setMessages((prev) => {
                prev = prev.concat(...data.messages);

                for (const message of data.messages) {
                    messagesMap.set(message.id, message)
                    const author = message.author;
                    authorsMap.set(author.id, author);
                }

                const MaxMessagesCount = 70;

                if (prev.length > MaxMessagesCount) {
                    const needToDeleteCount = prev.length - MaxMessagesCount;

                    for (let i = 0; i < needToDeleteCount; i++) {
                        const message = prev.shift();
                        messagesMap.delete(message.id);
                    }
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

                    if (config.eventsLogging) {
                        console.log("changed ", prevMessage, " to ", message);
                    }

                    Object.assign(prevMessage, message);
                }
            }
            forceUpdate();
        }
        else if (protocolMessageType === "MESSAGES_REMOVED") {
            let ids = [];
            const messages = data.messages;
            for (const i in messages) {
                const message = messages[i]
                ids.push(message.id);
            }
            removeMessages(ids);
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
        else if (protocolMessageType === "NEED_RELOAD") {
            window.location.reload();
        }
        else if (protocolMessageType === "SETTINGS_UPDATED") {
            setSettings(data.settings)
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
        const widgetType = searchParams.get("widget");

        if (widgetType === "messages") {
            return (<MessagesListView
                messages={messages}
                hideTimeout={settings.widgets.messages.hideTimeout}
                messageStyle={settings.widgets.messages.style}
                hideConnectionStatusWhenConnected={settings.widgets.hideConnectionStatusWhenConnected}
                showPlatformIcon={settings.widgets.messages.showPlatformIcon}
                />);
        }
        else if (widgetType === "selected-messages") {
            return (<MessagesListView
                messages={selectedMessages}
                hideTimeout={0}
                messageStyle={settings.widgets.messages.style}
                hideConnectionStatusWhenConnected={settings.widgets.hideConnectionStatusWhenConnected}
                showPlatformIcon={settings.widgets.messages.showPlatformIcon}
                />);
        }
        else if (widgetType === "states") {
            return (<ServicesListView
                services={services}
                appState={appState}
                hidePlatformIconIfCountIsUnknown={settings.widgets.states.hidePlatformIconIfCountIsUnknown} />);
        }
        else {
            return (<span className="errorText">Error: unknown widget</span>);
        }
    }
    else {
        return (
            <AnimatedDummyTextView
                type={readyState === ReadyState.CONNECTING ? IndicatorType.Loading : IndicatorType.Critical}
                text={connectionStatus}/>
        )
    }
};

export default RootView;