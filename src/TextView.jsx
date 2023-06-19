import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from 'antd';
const { Text } = Typography;

export class TextView extends React.Component {
    static propTypes = {
        text: PropTypes.string.isRequired,
    }

    static defaultProps = {
        text: "",
        settings: {
            visible: true,
            font: {
                color: "#00ffff",
                family: "Roboto",
                size: 20,
                weight: "400",
                italic: false,
                // text-decoration
                outlineWidth: 1,
                outlineColor: "#000000",
            },
        }
    }

    static getAvailableFontsFamilies() {
        return ['Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue']
    }

    render() {
        const font = this.props.settings.font

        const style = {
            color: font.color,
            fontSize: font.size,
            fontWeight: font.weight,
            fontStyle: font.italic ? "italic" : "normal",

            WebkitTextStrokeWidth: font.outlineWidth,
            WebkitTextStrokeColor: font.outlineColor,
        }

        return (
            <span>
            {this.props.settings.visible ? <Text style={style}>
                {this.props.text}
            </Text> : null}
            </span>
        )
    }
}