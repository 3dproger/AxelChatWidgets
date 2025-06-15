import React from 'react';
import PropTypes from 'prop-types';
import { Spin } from 'antd';
import { LoadingOutlined, CheckCircleOutlined, ApiOutlined } from '@ant-design/icons';

export const IndicatorType = {
    TextOnly: "TextOnly",
    Success: "Success",
    Loading: "Loading",
    Critical: "Critical"
};

export class AnimatedDummyTextView extends React.Component {
    static propTypes = {
        type: PropTypes.string,
        text: PropTypes.string.isRequired,
    }

    static defaultProps = {
        type: IndicatorType.Loading,
        text: "TEXT",
    }

    render() {
        const type = this.props.type;

        return (
        <>
        <Spin
            style={{"marginRight": "4px"}}
            indicator={<LoadingOutlined style={{
                fontSize: 24,
                verticalAlign: "middle",
                display: (type === IndicatorType.Loading ? "block" : "none"),
            }} spin />}/>

        <CheckCircleOutlined style={{
            fontSize: 24,
            verticalAlign: "middle",
            color: "lime",
            display: (type === IndicatorType.Success ? "inline" : "none"),
        }} />

        <ApiOutlined style={{
            fontSize: 32,
            verticalAlign: "middle",
            color: "red",
            display: (type === IndicatorType.Critical ? "inline" : "none"),
        }} />

        <span
            className="text"
            style={{
                marginLeft: "6px",
            }}
        >{this.props.text}</span>
        </>
        )
    }
}