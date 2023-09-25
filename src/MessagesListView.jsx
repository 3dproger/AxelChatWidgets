import React from 'react';
import PropTypes from 'prop-types';
import { AnimatedDummyTextView } from './AnimatedDummyTextView'
import { TextView } from './TextView'
import { Avatar, Typography } from 'antd';
const { Text, Link } = Typography;

class ContentView extends React.Component {
    static propTypes = {
        content: PropTypes.object.isRequired,
    }

    static defaultProps = {
        content: null,
        settings: {
            visible: true,
            text: {
                color: "#ffffff",
                family: "Roboto",
                size: 24,
                weight: "800",
                italic: false,
                outlineWidth: 1.1,
                outlineColor: "#000000",
            },
        },
    }

    render() {
        if (!this.props.settings.visible) {
            return(<span/>)
        }

        const content = this.props.content;
        if (!content) {
            return (
                <div>null</div>
            )
        }

        const type = content.type;
        const data = content.data;
        
        if (type === "text") {
            const text = data.text;
            return (<TextView text={text} settings={this.props.settings.text}/>)
        }
        else if (type === "image") {
            return (
                <img className="imageContent" alt="" src={data.url}></img>
            )
        }
        else if (type === "hyperlink") {
            return (
                <a className="hyperlinkContent" href={data.url}>{data.text}</a>
            )
        }

        return (
            <div>Unknown content type '{type}'</div>
        )
    }
}

class AuthorName extends React.Component {
    static propTypes = {
        author: PropTypes.object.isRequired,
        settings: PropTypes.object,
    }

    static defaultProps = {
        author: null,
        settings: {
            visible: true,
            useOnlyDefaultColor: false,
            text: {
                color: "#03A9F4",
                family: "Roboto",
                size: 24,
                weight: "950",
                italic: false,
                outlineWidth: 1.5,
                outlineColor: "#000000",
            }
        }
    }

    render() {
        const author = this.props.author;
        if (!author) {
            return (
                <span>Author is null</span>
            )
        }

        const name = author.name

        return (
            <span className='authorName'>
            {this.props.settings.visible ? <TextView text={name} settings={this.props.settings.text}/>: null}
            </span>
        )
    }
}

export class MessageView extends React.Component {
    static propTypes = {
        message: PropTypes.object.isRequired,
        settings: PropTypes.object,
    }

    static defaultProps = {
        message: null,
        settings: {
            type: "basic",
            avatar: {
                visible: true,
                shape: "circle",
                size: 40,
            },
            platformIcon: {
                visible: true,
                size: 20,
            },
            authorName: AuthorName.defaultProps.settings,
            content: ContentView.defaultProps.settings,
        }
    }
    
    render() {
        const message = this.props.message;
        if (!message) {
            return (
                <div>Message is null</div>
            )
        }

        const author = message.author;
        if (!author) {
            return (
                <div>Author is null</div>
            )
        }

        const forcedColors = message.forcedColors;

        var messageStyle = {};

        if (typeof forcedColors.bodyBackground === 'string')
        {
            messageStyle['backgroundColor'] = forcedColors.bodyBackground;
        }

        return (
            <div className='message' style={messageStyle}>
                {this.props.settings.platformIcon.visible ? <img className="badge" alt="" src={"./images/" + author.serviceId + "-icon.svg"}/> : null}

                {this.props.settings.avatar.visible ? <Avatar
                    size={this.props.settings.avatar.size > 0 ? this.props.settings.avatar.size : 1}
                    shape={this.props.settings.avatar.shape}
                    src={author.avatar}
                    /> : null}

                {author.leftBadges.map((badgeUrl, idx) => (
                    <img key={idx} className="badge" alt="" src={badgeUrl}></img>
                ))}

                <AuthorName author={author} />

                {author.rightBadges.map((badgeUrl, idx) => (
                    <img key={idx} className="badge" alt="" src={badgeUrl}></img>
                ))}

                {message.contents.map((content, idx) => (
                    <ContentView key={idx} content={content} />
                ))}
            </div>
        )
    }
}

export class MessagesListView extends React.Component {
    static propTypes = {
        messages: PropTypes.array.isRequired,
    }

    static defaultProps = {
        messages: [],
        settings: {
            container: {
                type: "list"
            },

            item: MessageView.defaultProps.settings
        }
    }

    scrollToBottom = () => {
        if (this.messagesEnd !== undefined && this.messagesEnd !== null) {
            this.messagesEnd.scrollIntoView({ behavior: "smooth" });
        }
    }

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    render() {
        if (this.props.messages.length === 0) {
            return (
                <AnimatedDummyTextView text="Connected! But no one has written anything yet" imageSrc="./images/tick.svg"/>
            )
        }
        else {
            return (
                <div className='messagesListView'>
                    {this.props.messages.map(message => (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }} key={message.id}><MessageView message={message} settings={this.props.settings.item} /></div>
                    ))}
    
                    <div style={{ float:"left", clear: "both" }}
                        ref={(el) => { this.messagesEnd = el; }}>
                    </div>
                </div>
            )
        }
    }
}