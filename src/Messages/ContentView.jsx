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
        return <span>null</span>;
      }
  
      const type = content.type;
      const className = content.htmlClassName;
      const data = content.data;
      const style = content.style;
  
      if (type === "text") {
        const text = data.text;

        return <span className={className} style={{...style, "whiteSpace": "pre-line" }}>{text}</span>;
      }
      else if (type === "image") {
        return <img className={className} style={style} alt="" src={data.url}></img>;
      }
      else if (type === "hyperlink") {
        return (
          <span> <a className={className} style={{...style, "whiteSpace": "pre-line" }} href={data.url}>
            <span>{data.text}</span>
          </a> </span>
        );
      }
      else if (type === "html") {
        return <span className={className} style={style} dangerouslySetInnerHTML={{__html: data.html}}/>
      }
  
      return <div>Unknown content type '{type}'</div>;
    }
  }
