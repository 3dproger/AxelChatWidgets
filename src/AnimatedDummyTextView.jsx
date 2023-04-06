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
            <div
                className="dummyAnimation"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                }}>

                <img className="dummyAnimationImage" alt="" width="60" height="60" src={this.props.imageSrc}></img>
                <br/>
                <div className="dummyAnimationText">{this.props.text}</div>
            </div>
        )
    }
}