import React from "react";
import PropTypes from "prop-types";
import { ContentView } from "./ContentView"
import { AuthorView } from "./AuthorView";
import { TimeView } from "./TimeView";

function isMessageAuthorVisible(message) {
    if (message.markedAsDeleted || message.deletedOnPlatform) {
        return false;
    }

    return true;
}

function getAuthorContent(message, showPlatformIcon) {
    if (!isMessageAuthorVisible(message)) {
        return <></>
    }

    return (<>
        <AuthorView author={message.author} showPlatformIcon={showPlatformIcon}/>

        {message.multiline ?
            (
                <br/>
            ) :
            (
                <span className="authorMessageContentSeparator"></span>
            )
        }
    </>)
}

export class MessageView extends React.Component {
    static propTypes = {
        message: PropTypes.object.isRequired,
        hideTimeout: PropTypes.number,
        messageStyle: PropTypes.object,
        showPlatformIcon: PropTypes.bool,
    };

    static defaultProps = {
        message: null,
        hideTimeout: 0,
        messageStyle: {},
        showPlatformIcon: true,
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

    getMessageStyle() {
        const message = this.props.message;
        const forcedColors = message.forcedColors;

        let r = {
            'visibility': this.state.visibility,
            ...this.props.messageStyle,
        };

        if (forcedColors.bodyBackground !== undefined) {
            r["backgroundColor"] = forcedColors.bodyBackground
        }

        if (forcedColors.bodyBorder !== undefined) {
            r["borderWidth"] = "2px"
            r["borderStyle"] = "solid"
            r["borderColor"] = forcedColors.bodyBorder
        }

        return r
    }

    render() {
        const message = this.props.message;
        if (!message) {
            return <span className="null_message">NULL_MESSAGE</span>;
        }

        //console.log(message)

        return (
        <span
            className={"message" + (this.state.needToHide ? " hiddenFadeOut" : "")}
            style={this.getMessageStyle()}>
            
            <TimeView timeIso={message.publishedAt}/>

            {getAuthorContent(message, this.props.showPlatformIcon)}

            <span className="messageContents">
                {message.contents.map((content, idx) => (
                    <ContentView key={idx} content={content} />
                ))}
            </span>
        </span>
        );
    }
}
