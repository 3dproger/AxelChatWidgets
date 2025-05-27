import React from "react";
import PropTypes from "prop-types";
import { AnimatedDummyTextView, IndicatorType } from "../AnimatedDummyTextView";
import { MessageView } from "./MessageView";

export class MessagesListView extends React.Component {
  static propTypes = {
    messages: PropTypes.array.isRequired,
    hideTimeout: PropTypes.number,
    hideConnectionStatusWhenConnected: PropTypes.bool,
  };

  static defaultProps = {
    messages: [],
    hideTimeout: 0,
    hideConnectionStatusWhenConnected: false,
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
      if (this.props.hideConnectionStatusWhenConnected) {
          return (<></>)
      }
      else {
        return (
          <AnimatedDummyTextView
            type={IndicatorType.Image}
            text="Connected!"
            imageSrc="./images/tick.svg"
          />
        );
      }
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
