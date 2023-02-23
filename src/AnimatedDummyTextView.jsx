import React from 'react';
import PropTypes from 'prop-types';

export class AnimatedDummyTextView extends React.Component {
    static propTypes = {
        text: PropTypes.string.isRequired,
        imageSrc: PropTypes.string.isRequired,
    }

    static defaultProps = {
        text: "TEXT",
        imageSrc: "./images/cool_200_transparent.gif",
    }

    render() {
        return (
            <div className="dummyAnimation">
                <img alt="" src={this.props.imageSrc}></img>
                <br/>
                <span className="dummyAnimationText">{this.props.text}</span>
            </div>
        )
    }
}