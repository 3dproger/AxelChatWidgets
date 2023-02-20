import React, { useState, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { MessagesListView } from './MessagesListView';
import { ServicesListView } from './ServicesListView'

export const CoreView = () => {
    const [messageHistory, setMessageHistory] = useState([]);
    const [services, setServices] = useState([]);
    const [appState, setState] = useState({
        viewers: -1,
    });
    const { sendMessage, lastMessage, readyState } = useWebSocket('ws://127.0.0.1:8355', {
        onOpen: () => {
            console.log('Opened socket')
            setMessageHistory([]);
        },
        shouldReconnect: (closeEvent) => true,
    });

    useEffect(() => {
        if (!lastMessage) {
            return;
        }

        const protocolMessage = JSON.parse(lastMessage.data);
        const protocolMessageType = protocolMessage.type;
        const data = protocolMessage.data;

        //console.log(protocolMessage);

        if (protocolMessageType === "state") {
            setServices(data.services);
            setState(data);
        }
        else if (protocolMessageType === "messages") {
            setMessageHistory((prev) => prev.concat(...data.messages));
        }
        else if (protocolMessageType === "hello") {
            // ignore
        }
        else {
            console.error("Unknown message type '" + protocolMessageType + "', protocol message = '" + protocolMessage + "'");
        }

    }, [lastMessage, setMessageHistory]);
    
    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    if (readyState == ReadyState.OPEN) {
        return (
            <div>
                <MessagesListView messages={messageHistory} />
                <ServicesListView services={services} appState={appState} />
            </div>
        )
    }
    else {
        return (
            <div><span className="status">AxelChat is {connectionStatus}</span></div>
        )
    }
};

export default CoreView;