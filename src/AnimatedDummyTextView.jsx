import React from 'react';
import PropTypes from 'prop-types';

export class AnimatedDummyTextView extends React.Component {
    static propTypes = {
        text: PropTypes.string.isRequired,
        imageSrc: PropTypes.string.isRequired,
    }

    static defaultProps = {
        text: "TEXT",
        imageSrc: "./images/tick.svg",
    }

    render() {
        return (
            <span>
                <img className="badgeServiceIcon" alt="" src={this.props.imageSrc}/>
                <span className="authorName">{this.props.text}</span>
            </span>
        )
    }
}