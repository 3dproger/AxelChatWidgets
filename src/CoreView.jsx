import React, { useState, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { ViewersCountView } from './ViewersCountView'
import { MessagesListView } from './MessagesListView';

export const CoreView = () => {
    const [messageHistory, setMessageHistory] = useState([]);
    const [services, setServices] = useState([]);
    const [info, setState] = useState({
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

                <div align="middle">
                    {services.map((service, idx) => (
                        <ViewersCountView key={idx} service={service} />
                    ))}

                    <img alt="" className="badge" src="./images/viewer.svg"/>
                    <span className="text">{info.viewers > -1 ? info.viewers : "?"}</span>
                </div>
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