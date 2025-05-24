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
  
      if (type === "text") {
        const text = data.text;
        return <span className={className} style={{"white-space": "pre-line"}}>{text}</span>;
      }
      else if (type === "image") {
        return <img className={className} alt={data.alt} src={data.url}></img>;
      }
      else if (type === "hyperlink") {
        return (
          <span> <a className={className} href={data.url} style={{"white-space": "pre-line"}}>
            <span>{data.text}</span>
          </a> </span>
        );
      }
      else if (type === "html") {
        return <span className={className} dangerouslySetInnerHTML={{__html: data.html}}/>
      }
  
      return <div>Unknown content type '{type}'</div>;
    }
  }
