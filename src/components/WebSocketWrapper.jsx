import React, { useState, useCallback, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { ViewersCountView } from './ViewersCountView'

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
                for (const message of data.messages) {
                    var text = "";
                    for (const content  of message.contents) {
                        if (content.type === "text") {
                            text += content.data.text;
                        }
                        else if (content.type === "hyperlink") {
                            text += content.data.text;
                        }
                        else if (content.type === "image") {
                            text += content.data.url;
                        }
                        else {
                            console.error("Unknown content type '" + content.type + "', protocol message = '" + protocolMessage + "'");
                        }
                    }

                    setMessageHistory((prev) => prev.concat(text));
                }
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
            <div>
                {services.map((service, idx) => (
                    <ViewersCountView service={service} />
                ))}
            </div>

            <span>WebSocket is {connectionStatus}</span>

            {messageHistory.map((message, idx) => (
                <span key={idx}>{message ? message : null}<br/></span>
            ))}
        </div>
    );
};

export default WebSocketWrapper;