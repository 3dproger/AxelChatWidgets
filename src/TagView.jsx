import React from "react";
import PropTypes from "prop-types";

export class TagView extends React.Component {
    static propTypes = {
        tag: PropTypes.object.isRequired,

        text: PropTypes.string.isRequired,
        backgroundColor: PropTypes.string,
        textColor: PropTypes.string,
    };
  
    static defaultProps = {
        tag: {
            text: "tag",
            backgroundColor: "#03A9F4",
            textColor: "black",
        }
    };
  
    render() {
        const tag = this.props.tag;
        if (!tag) {
          return <span>null</span>;
        }

        return <span
            className="tag"
            style={{
                "background-color": tag.backgroundColor,
                "color": tag.textColor,
            }}
            >
            {tag.text}
        </span>;
    }
  }
