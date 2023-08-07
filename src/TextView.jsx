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
            color: "#00ffff",
            family: "Roboto",
            size: 20,
            weight: "400",
            italic: false,
            // text-decoration
            outlineWidth: 1,
            outlineColor: "#000000",
        }
    }

    static getAvailableFontsFamilies() {
        return ['Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue']
    }

    render() {
        const settings = this.props.settings

        const style = {
            color: settings.color,
            fontSize: settings.size,
            fontWeight: settings.weight,
            fontStyle: settings.italic ? "italic" : "normal",

            WebkitTextStrokeWidth: settings.outlineWidth,
            WebkitTextStrokeColor: settings.outlineColor,
        }

        return (
            <Text className='text' style={style}>
                {this.props.text}
            </Text>
        )
    }
}