import React from 'react';
import PropTypes from 'prop-types';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

export const IndicatorType = {
    Image: "Image",
    Spin: "Spin",
};

export class AnimatedDummyTextView extends React.Component {
    static propTypes = {
        type: PropTypes.string,
        text: PropTypes.string.isRequired,
        imageSrc: PropTypes.string.isRequired,
    }

    static defaultProps = {
        type: IndicatorType.Spin,
        text: "TEXT",
        imageSrc: "./images/tick.svg",
    }

    render() {
        if (this.props.type === IndicatorType.Spin) {
            return (
                <span>
                    <Spin style={{"margin-right": "4px"}} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}/>
                    <span className="authorName">{this.props.text}</span>
                </span>
            )
        }

        return (
            <span>
                <img className="badgeServiceIcon" alt="" src={this.props.imageSrc}/>
                <span className="authorName">{this.props.text}</span>
            </span>
        )
    }
}