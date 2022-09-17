import React, { useState, useCallback, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { ViewersCountView } from './ViewersCountView'
import { MessageView } from './MessageView';

const MessagesListView = ({messages}) => (
    <div>
        {messages.map(message => (
            <div><MessageView message={message} /></div>
        ))}
    </div>
);

export const WebSocketWrapper = () => {
    const [socketUrl, setSocketUrl] = useState('ws://127.0.0.1:12345');
    const [messageHistory, setMessageHistory] = useState([]);
    const [services, setServices] = useState([]);
    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

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

            <div class="viewers-count-list-view">
                {services.map((service, idx) => (
                    <ViewersCountView service={service} />
                ))}
            </div>
        </div>
    )
};

export default WebSocketWrapper;