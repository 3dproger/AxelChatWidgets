import React from 'react';
import PropTypes from 'prop-types';
import './MessageView.css'

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
        
        if (type === "image") {
            return (
                <img className="imageContent" src={data.url}></img>
            )
        }

        if (type === "hyperlink") {
            return (
                <a className="hyperlinkContent" href={data.url}>{data.text}</a>
            )
        }

        return (
            <div>Unknown content type '{type}'</div>
        )
    }
}

export class MessageView extends React.Component {
    static propTypes = {
        message: PropTypes.object.isRequired,
    }

    static defaultProps = {
        message: null,
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
                <img className="avatar" src={author.avatar}></img>

                <img className="badge" src={"./images/" + author.serviceId + "-icon.svg"}></img>

                {author.leftBadges.map(badgeUrl => (
                    <img className="badge" src={badgeUrl}></img>
                ))}

                <span className="authorName">{author.name}&nbsp;</span>

                {author.rightBadges.map(badgeUrl => (
                    <img className="badge" src={badgeUrl}></img>
                ))}

                {message.contents.map(content => (
                    <ContentView content={content} />
                ))}
            </div>
        )
    }
}