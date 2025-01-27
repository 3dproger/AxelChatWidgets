import React from "react";
import PropTypes from "prop-types";

export class ContentView extends React.Component {
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
