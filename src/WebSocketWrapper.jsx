import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { ViewersCountView } from './ViewersCountView'
import { MessageView } from './MessageView';

class MessagesListView extends React.Component {
    static propTypes = {
        messages: PropTypes.array.isRequired,
    }

    static defaultProps = {
        messages: [],
    }

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    render() {
        return (
            <div>
                {this.props.messages.map(message => (
                    <div key={message.id}><MessageView message={message} /></div>
                ))}

                <div style={{ float:"left", clear: "both" }}
                    ref={(el) => { this.messagesEnd = el; }}>
                </div>
            </div>
        )
    }
}

export const WebSocketWrapper = () => {
    const [messageHistory, setMessageHistory] = useState([]);
    const [services, setServices] = useState([]);
    const [info, setInfo] = useState({
        viewersCountTotal: -1,
    });
    const { sendMessage, lastMessage, readyState } = useWebSocket('ws://127.0.0.1:12345', {
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

        console.log(protocolMessage);

        if (protocolMessageType === "info") {
            setServices(data.services);
            setInfo(data);
        }
        else if (protocolMessageType === "chat_messages") {
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

    return (
        <div>
            <span>AxelChat is {connectionStatus}</span><br/>

            <MessagesListView messages={messageHistory} />

            <div align="middle">
                {services.map((service, idx) => (
                    <ViewersCountView key={idx} service={service} />
                ))}

                <img alt="" class="badge" src="./images/viewer.svg"/>
                <span class="text">{info.viewersCountTotal !== -1 ? info.viewersCountTotal : "?"}</span>
            </div>
        </div>
    )
};

export default WebSocketWrapper;