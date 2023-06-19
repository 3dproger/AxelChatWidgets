import React from 'react';
import PropTypes from 'prop-types';
import { MessagesListView } from './MessagesListView';
import { TextView } from './TextView';
import { InputNumber, Select, Space, Card, ColorPicker, Checkbox, Switch } from 'antd';

class TextViewEditor extends React.Component {
    static defaultProps = {
        settings: TextView.defaultProps.settings,

        onChange: (settings) => {
            console.log("settings changed but callback not setted")
        },
    }

    static getAvailableFontsFamiliesOptions() {
        var result = []

        const families = TextView.getAvailableFontsFamilies()
        for (const family of families)
        {
            result.push({
                label: family,
                value: family
            })
        }

        return result
    }

    updateSettings() {
        this.props.onChange(this.props.settings)
    }

    render(){
        return(
            <div>
                Text color:
                <ColorPicker
                    defaultValue={this.props.settings.color}
                    onChange={(value) => {
                        this.props.settings.color = value.toHexString()
                        this.updateSettings()
                    }} />

                <br/>

                Font family:
                <Select
                    showSearch
                    defaultValue={this.props.settings.family}
                    onChange={(value) => {
                        this.props.settings.family=value
                        this.updateSettings()
                    }}
                    options={TextViewEditor.getAvailableFontsFamiliesOptions()}
                />

                <br/>

                Font size:
                <InputNumber
                    min={1}
                    max={300}
                    defaultValue={this.props.settings.size}
                    onChange={(value) => {
                        this.props.settings.size=value
                        this.updateSettings()
                    }} />
                
                <br/>

                Weight:
                <Select
                    defaultValue={this.props.settings.weight}
                    onChange={(value) => {
                        this.props.settings.weight=value
                        this.updateSettings()
                    }}
                    options={[
                        {
                            label: "Thin (100)",
                            value: "100"
                        },
                        {
                            label: "Extra Light (200)",
                            value: "200"
                        },
                        {
                            label: "Light (300)",
                            value: "300"
                        },
                        {
                            label: "Normal (400)",
                            value: "400"
                        },
                        {
                            label: "Medium (500)",
                            value: "500"
                        },
                        {
                            label: "Semi Bold (600)",
                            value: "600"
                        },
                        {
                            label: "Bold (700)",
                            value: "700"
                        },
                        {
                            label: "Extra Bold (800)",
                            value: "700"
                        },
                        {
                            label: "Black (900)",
                            value: "900"
                        },
                        {
                            label: "Extra Black (950)",
                            value: "950"
                        },
                    ]}
                />

                <br/>

                <Checkbox
                    defaultChecked={this.props.settings.italic}
                    onChange={(e) =>{
                        this.props.settings.italic = e.target.checked
                        this.updateSettings()
                    }}>
                    Italic
                </Checkbox>

                <br/>

                Outline width:
                <InputNumber
                    min={0}
                    max={100}
                    step={0.1}
                    defaultValue={this.props.settings.outlineWidth}
                    onChange={(value) => {
                        this.props.settings.outlineWidth=value
                        this.updateSettings()
                    }} />

                <br/>

                Outline color:
                <ColorPicker
                    defaultValue={this.props.settings.outlineColor}
                    onChange={(value) => {
                        this.props.settings.outlineColor = value.toHexString()
                        this.updateSettings()
                    }} />
            </div>)
    }
}

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
                    <TextViewEditor
                        settings={this.props.settings.item.content.text}
                        onChange={(settings)=>{
                            this.props.settings.item.content.text=settings
                        }}
                        />
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