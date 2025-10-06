import React from 'react';
import PropTypes from 'prop-types';
import { Spin } from 'antd';
import { LoadingOutlined, CheckCircleOutlined, ApiOutlined } from '@ant-design/icons';

interface AnimatedDummyTextViewProps {
    type: "TEXT_ONLY" | "SUCCESS" | "LOADING" | "CRITICAL" | undefined;
    text: string;
}

export function AnimatedDummyTextView({type, text}: AnimatedDummyTextViewProps) {
    if (!type) {
        type = "LOADING";
    }

    return (<>
        <Spin
            style={{"marginRight": "4px"}}
            indicator={<LoadingOutlined style={{
                fontSize: 24,
                verticalAlign: "middle",
                display: (type === "LOADING" ? "block" : "none"),
            }} spin />}/>

        <CheckCircleOutlined style={{
            fontSize: 24,
            verticalAlign: "middle",
            color: "lime",
            display: (type === "SUCCESS" ? "inline" : "none"),
        }} />

        <ApiOutlined style={{
            fontSize: 32,
            verticalAlign: "middle",
            color: "red",
            display: (type === "CRITICAL" ? "inline" : "none"),
        }} />

        <span
            className="text"
            style={{
                marginLeft: "6px",
            }}
        >{text}</span>
    </>)
}