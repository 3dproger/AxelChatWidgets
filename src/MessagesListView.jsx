import React from "react";
import PropTypes from "prop-types";
import { AnimatedDummyTextView, IndicatorType } from "./AnimatedDummyTextView";
import { Avatar, Typography } from "antd";

class ContentView extends React.Component {
  static propTypes = {
    content: PropTypes.object.isRequired,
  };

  static defaultProps = {
    content: null,
  };

  render() {
    const content = this.props.content;
    if (!content) {
      return <div>null</div>;
    }

    const type = content.type;
    const data = content.data;

    if (type === "text") {
      const text = data.text;
      return <span className="text">{text}</span>;
    } else if (type === "image") {
      return <img className="imageContent" alt="" src={data.url}></img>;
    } else if (type === "hyperlink") {
      return (
        <span> <a className="hyperlinkContent" href={data.url}>
          <span>{data.text}</span>
        </a> </span>
      );
    }

    return <div>Unknown content type '{type}'</div>;
  }
}

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

export class MessagesListView extends React.Component {
  static propTypes = {
    messages: PropTypes.array.isRequired,
    hideTimeout: PropTypes.number,
  };

  static defaultProps = {
    messages: [],
    hideTimeout: 0,
  };

  scrollToBottom = () => {
    if (this.messagesEnd !== undefined && this.messagesEnd !== null) {
      this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }
  };

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  render() {
    if (this.props.messages.length === 0) {
      return (
        <AnimatedDummyTextView
          type={IndicatorType.Image}
          text="Connected!"
          imageSrc="./images/tick.svg"
        />
      );
    } else {
      return (
        <div className="messagesListView">
          {this.props.messages.map((message) => (
            <div
              style={{ display: "flex", justifyContent: "space-between" }}
              key={message.id}
            >
              <MessageView
                message={message}
                hideTimeout={this.props.hideTimeout}
              />
            </div>
          ))}

          <div
            style={{ float: "left", clear: "both" }}
            ref={(el) => {
              this.messagesEnd = el;
            }}
          ></div>
        </div>
      );
    }
  }
}
