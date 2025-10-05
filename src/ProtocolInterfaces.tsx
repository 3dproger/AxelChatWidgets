import CSS from "csstype";

export interface MessageUserTag {
  readonly text: string;
  readonly backgroundColor: CSS.DataType.Color;
  readonly textColor: CSS.DataType.Color;
}

export interface MessageUser {
    readonly id: string;
    readonly name: string;
    readonly avatar: string;
    readonly pageUrl: string;
    readonly color: CSS.DataType.Color;
    readonly customBackgroundColor: CSS.DataType.Color;
    readonly leftBadges: string[];
    readonly rightBadges: string[];
    readonly leftTags: MessageUserTag[];
    readonly rightTags: MessageUserTag[];
    readonly serviceBadge: string;
    readonly serviceId: string;
}

export interface MessageContentData {
    readonly text?: string;
    readonly url?: string;
    readonly html?: string;
}

export interface MessageContent {
    readonly type: "text" | "image" | "hyperlink" | "html";
    readonly htmlClassName: string;
    readonly data: MessageContentData;
    readonly style: object;
}

export interface Message {
    readonly id: string;
    readonly author: MessageUser;
    readonly contents: MessageContent[];
    readonly customAuthorAvatarUrl: string;
    readonly customAuthorName: string;
    readonly deletedOnPlatform: boolean;
    readonly edited: boolean;
    readonly eventType: "Message";
    readonly forcedColors: {
        readonly bodyBackground?: CSS.DataType.Color;
        readonly bodyBorder?: CSS.DataType.Color;
    };
    readonly markedAsDeleted: boolean;
    readonly multiline: boolean;
    readonly publishedAt: string;
    readonly receivedAt: string;
    readonly raw: any;
    readonly rawType: string;
    readonly reply: any;
}

export interface PlatformState {
    enabled: boolean;
    connection_state: "not_connected" | "connecting" | "connected";
    icon: string;
    type_id: string;
    viewers: number;
}

export interface AppState {
    viewers: number;
}

export interface ProtocolMessage {
    type: string;
    data: any;
}

export interface StatesChangedData {
    viewers: number;
    services: PlatformState[];
}

export interface AppState {
    viewers: number;
}
