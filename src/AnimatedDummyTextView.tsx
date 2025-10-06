import React from 'react';
import PropTypes from 'prop-types';
import { Spin } from 'antd';
import { LoadingOutlined, CheckCircleOutlined, ApiOutlined } from '@ant-design/icons';

interface AnimatedDummyTextViewProps {
    type: "TextOnly" | "Success" | "Loading" | "Critical" | undefined;
    text: string;
}

export function AnimatedDummyTextView({type, text}: AnimatedDummyTextViewProps) {
    if (!type) {
        type = "Loading";
    }

    return (<>
        <Spin
            style={{"marginRight": "4px"}}
            indicator={<LoadingOutlined style={{
                fontSize: 24,
                verticalAlign: "middle",
                display: (type === "Loading" ? "block" : "none"),
            }} spin />}/>

        <CheckCircleOutlined style={{
            fontSize: 24,
            verticalAlign: "middle",
            color: "lime",
            display: (type === "Success" ? "inline" : "none"),
        }} />

        <ApiOutlined style={{
            fontSize: 32,
            verticalAlign: "middle",
            color: "red",
            display: (type === "Critical" ? "inline" : "none"),
        }} />

        <span
            className="text"
            style={{
                marginLeft: "6px",
            }}
        >{text}</span>
    </>)
}