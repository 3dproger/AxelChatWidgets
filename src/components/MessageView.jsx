import React from 'react';
import PropTypes from 'prop-types';

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
                <span>{text}</span>
            )
        }
        
        if (type === "image") {
            return (
                <img height="20" src={data.url}></img>
            )
        }

        if (type === "hyperlink") {
            return (
                <a href={data.url}>{data.text}</a>
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
            <div class="message">
                <span>
                    <img src={"./images/" + author.serviceId + "-icon.svg"} height="20"></img>
                </span>

                <span>
                    <img src={author.avatar} height="40"></img>
                </span>

                <span>
                    {author.name}:&#32;
                </span>

                {message.contents.map(content => (
                    <ContentView content={content} />
                ))}
            </div>
        )
    }
}