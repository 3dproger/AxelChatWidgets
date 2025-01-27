import React from "react";
import PropTypes from "prop-types";
import { ContentView } from "./ContentView"

export class MessageView extends React.Component {
    static propTypes = {
        message: PropTypes.object.isRequired,
        hideTimeout: PropTypes.number,
    };

    static defaultProps = {
        message: null,
        hideTimeout: 0,
    };

    constructor(props) {
        super(props)

        this.state = {
        needToHide: false,
        };

        if (props.hideTimeout > 0)
        {
        setTimeout(() => 
            {
            this.setState({
                needToHide: true,
            });
            }, props.hideTimeout)
        }
    }

    render() {
        const message = this.props.message;
        if (!message) {
        return <div>Message is null</div>;
        }

        const author = message.author;
        if (!author) {
        return <div>Author is null</div>;
        }

        const forcedColors = message.forcedColors;
        //console.log(message)

        return (
        <span className={"message" + (this.state.needToHide ? " hiddenFadeOut" : "")} style={{"backgroundColor": forcedColors.bodyBackground, 'visibility': this.state.visibility}}>
            <span className="badges">
            <img
                className="badgeServiceIcon"
                alt={author.serviceId + "-badge"}
                src={author.serviceBadge}
            />

            {author.leftBadges.map((badgeUrl, idx) => (
                <img key={idx} className="badgeLeft" alt="" src={badgeUrl}></img>
            ))}
            </span>

            <span
            className={"authorName" + (author.customBackgroundColor.length  > 0 ? " authorNameCustomBackgroundColor" : "")}
            style={{
                "color": author.color,
                "backgroundColor": author.customBackgroundColor,
            }}>
                {author.name}
            </span>

            {author.rightBadges.map((badgeUrl, idx) => (
            <img key={idx} className="badgeRight" alt="" src={badgeUrl}></img>
            ))}

            <span className="authorMessageContentSeparator"></span>

            <span className="messageContents">
            {message.contents.map((content, idx) => (
                <ContentView key={idx} content={content} />
            ))}
            </span>
        </span>
        );
    }
}
