import React, { useState, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { ViewersCountView } from './ViewersCountView'
import { MessageView } from './MessageView';

const MessagesListView = ({messages}) => (
    <div>
        {messages.map(message => (
            <div key={message.id}><MessageView message={message} /></div>
        ))}
    </div>
);

export const WebSocketWrapper = () => {
    const [messageHistory, setMessageHistory] = useState([]);
    const [services, setServices] = useState([]);
    const { sendMessage, lastMessage, readyState } = useWebSocket('ws://127.0.0.1:12345', {
        onOpen: () => {
            console.log('Opened socket')
            setMessageHistory([]);
        },
        shouldReconnect: (closeEvent) => true,
    });

    useEffect(() => {
        if (lastMessage !== null) {
            const protocolMessage = JSON.parse(lastMessage.data);
            const protocolMessageType = protocolMessage.type;
            const data = protocolMessage.data;

            console.log(protocolMessage);

            if (protocolMessageType === "info") {
                setServices(data.services)
            }
            else if (protocolMessageType === "chat_messages") {
                setMessageHistory((prev) => prev.concat(...data.messages));
            }
            else {
                console.error("Unknown message type '" + protocolMessageType + "', protocol message = '" + protocolMessage + "'");
            }
        }
    }, [lastMessage, setMessageHistory]);
    
    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    return (
        <div>
            <span>AxelChat is {connectionStatus}</span><br/>

            <MessagesListView messages={messageHistory} />

            <div>
                {services.map((service, idx) => (
                    <ViewersCountView key={idx} service={service} />
                ))}
            </div>
        </div>
    )
};

export default WebSocketWrapper;