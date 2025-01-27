import React from "react";
import PropTypes from "prop-types";
import { ContentView } from "./ContentView"
import { AuthorView } from "./AuthorView";

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
            return <span className="null_message">NULL_MESSAGE</span>;
        }

        const forcedColors = message.forcedColors;
        console.log(message)

        return (
        <span
            className={"message" + (this.state.needToHide ? " hiddenFadeOut" : "")}
            style={{
                    "backgroundColor": forcedColors.bodyBackground,
                    //"borderColor": forcedColors.bodyBorder,
                    //"border": "4em solid red",
                    'visibility': this.state.visibility
                }}>

            <AuthorView author={message.author}/>

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
