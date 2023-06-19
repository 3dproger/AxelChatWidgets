import React from 'react';
import PropTypes from 'prop-types';
import { AnimatedDummyTextView } from './AnimatedDummyTextView'
import { Avatar, Typography } from 'antd';
const { Text, Link } = Typography;

class ContentView extends React.Component {
    static propTypes = {
        content: PropTypes.object.isRequired,
    }

    static defaultProps = {
        content: null,
    }

    render() {
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
            return (
                <span className="textContent">{text}</span>
            )
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
            defaultColor: "#03A9F4",
            useOnlyDefaultColor: false,
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
        const color = this.props.settings.useOnlyDefaultColor ? this.props.settings.defaultColor : author.color
        const backgroundColor = author.backgroundColor

        var style = {};

        if (color !== "") {
            style.color = color
            console.log(color)
        }

        if (backgroundColor !== "") {
            style.backgroundColor = backgroundColor
        }

        return (
            <Text className="authorName" style={style}>
                {name}
            </Text>
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
            authorName: AuthorName.defaultProps.settings,
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

        return (
            <div className='message'>
                <a className='messageAuthorLink' href="#">
                    <img className="badge" alt="" src={"./images/" + author.serviceId + "-icon.svg"}></img>
                    
                    {this.props.settings.avatar.visible ? <Avatar
                        size={this.props.settings.avatar.size > 0 ? this.props.settings.avatar.size : 1}
                        shape={this.props.settings.avatar.shape}
                        src={author.avatar}
                        /> : null}

                    {author.leftBadges.map((badgeUrl, idx) => (
                        <img key={idx} className="badge" alt="" src={badgeUrl}></img>
                    ))}

                    <AuthorName author={author} />
                </a>

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
                <div>
                    {this.props.messages.map(message => (
                        <div key={message.id}><MessageView message={message} settings={this.props.settings.item} /></div>
                    ))}
    
                    <div style={{ float:"left", clear: "both" }}
                        ref={(el) => { this.messagesEnd = el; }}>
                    </div>
                </div>
            )
        }
    }
}