import React from 'react';
import PropTypes from 'prop-types';
import { MessagesListView } from './MessagesListView';
import { InputNumber, Select, Space } from 'antd';

class EditorPanel extends React.Component {
    static defaultProps = {
        settings: MessagesListView.defaultProps.settings,

        onChange: (settings) => {
            console.log("settings changed but callback not setted")
        }
    }

    updateSettings() {
        this.props.onChange(this.props.settings)
    }

    render() {
        return (
            <Space wrap>
                Shape:
                <Select
                    defaultValue={this.props.settings.item.avatar.shape}
                    onChange={(value) => {
                        this.props.settings.item.avatar.shape=value
                        this.updateSettings()
                    }}
                    style={{
                        width: 100,
                    }}
                    options={[
                        {
                            label: "Square",
                            value: "square"
                        },
                        {
                            label: "Circle",
                            value: "circle"
                        },
                    ]}
                    />

                Size:
                <InputNumber
                    min={1}
                    max={500}
                    defaultValue={this.props.settings.item.avatar.size}
                    onChange={(value) => {
                        this.props.settings.item.avatar.size=value
                        this.updateSettings()
                    }} />
            </Space>
        )
    }
}

export class MessagesWidgetEditorView extends React.Component {
    static propTypes = {
        messages: PropTypes.array.isRequired,
    }

    static defaultProps = {
        messages: [],
        settings: MessagesListView.defaultProps,
    }

    state = {
        settings: {
            container: {
                type: "list"
            },

            item: {
                avatar: {
                    shape: "round"
                }
            }
        }
    }

    render() {
        return (
            <div>
                <table>
                <tr>
                    <td><MessagesListView messages={this.props.messages} settings={this.state.settings.item} /></td>
                    <td><EditorPanel
                        onChange={(settings)=>{
                            this.setState({ settings: settings })
                        }}
                        /></td>
                </tr>
                </table>  
            </div>
        )
    }
}