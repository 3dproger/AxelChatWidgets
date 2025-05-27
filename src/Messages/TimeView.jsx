import React from "react";
import PropTypes from "prop-types";

export class TimeView extends React.Component {
    static propTypes = {
        timeIso: PropTypes.string.isRequired,
    };
  
    static defaultProps = {
        timeIso: null,
    };
  
    constructor(props) {
        super(props)
        this.state = {
            dateText: "",
            timeText: ""
        }

        const date = new Date(props.timeIso);
        this.state.dateText = date.toLocaleDateString();
        this.state.timeText = date.toLocaleTimeString()
    }

    render() {
      const timeText = this.state.timeText;
      const dateText = this.state.dateText;
  
      return (<span>
            <span className="time">{timeText}</span>
            <span className="date">{dateText}</span>
        </span>)
    }
  }
