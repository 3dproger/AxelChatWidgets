import React from 'react';
import PropTypes from 'prop-types';
import { MessagesListView } from './MessagesListView';
import { InputNumber, Select, Space, Card, ColorPicker, Checkbox, Switch } from 'antd';

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
            <Space wrap direction="vertical">
                <Card title="Avatar" size="small" extra={
                    <Switch
                        defaultChecked={this.props.settings.item.avatar.visible}
                        onChange={(checked)=>{
                            this.props.settings.item.avatar.visible=checked
                        }}
                        />
                }>
                    Shape:
                    <Select
                        defaultValue={this.props.settings.item.avatar.shape}
                        onChange={(value) => {
                            this.props.settings.item.avatar.shape=value
                            this.updateSettings()
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

                    <br/>

                    Size:
                    <InputNumber
                        min={1}
                        max={500}
                        defaultValue={this.props.settings.item.avatar.size}
                        onChange={(value) => {
                            this.props.settings.item.avatar.size=value
                            this.updateSettings()
                        }} />
                
                </Card>
                
                <Card title="Author name" size="small" extra={
                    <Switch
                        defaultChecked={this.props.settings.item.authorName.visible}
                        onChange={(checked)=>{
                            this.props.settings.item.authorName.visible=checked
                        }}
                        />
                }>
                    <Checkbox
                        defaultChecked={this.props.settings.item.authorName.useOnlyDefaultColor}
                        onChange={(e) =>{
                            this.props.settings.item.authorName.useOnlyDefaultColor = e.target.checked
                        }}>
                        Use only default color
                    </Checkbox>

                    <br/>
                    
                    Default color:
                    <ColorPicker
                        defaultValue={this.props.settings.item.authorName.defaultColor}
                        onChange={(value) => {
                            this.props.settings.item.authorName.defaultColor = value.toHexString()
                            this.updateSettings()
                        }} />
                </Card>
                
                <Card title="Message content" size="small" extra={
                    <Switch
                        defaultChecked={this.props.settings.item.content.visible}
                        onChange={(checked)=>{
                            this.props.settings.item.content.visible=checked
                        }}
                        />
                }>
                </Card>
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
    }

    state = {
        settings: MessagesListView.defaultProps,
    }

    render() {
        return (
            <Space
                direction="horizontal"
                style={{
                    backgroundColor: '#F0F2F5',
                    height: '100vh',
                    width: '100%',
                }}>
                <Card
                    title="Chat"
                    bordered={false}
                    style={{
                        height: 600,
                        width: 300,
                    }}
                    >
                    <MessagesListView messages={this.props.messages} settings={this.state.settings.item} />
                </Card>

                <Card
                    title="Settings"
                    bordered={false}
                    >
                    <EditorPanel
                        onChange={(settings)=>{
                            this.setState({ settings: settings })
                        }}
                        />
                </Card>
            </Space>
        )
    }
}