export interface MessageUserTag {
  text: string;
  backgroundColor: string;
  textColor: string;
}

export interface MessageUser {
    id: string;
    name: string;
    avatar: string;
    pageUrl: string;
    color: string;
    customBackgroundColor: string;
    leftBadges: string[];
    rightBadges: string[];
    leftTags: MessageUserTag[];
    rightTags: MessageUserTag[];
    serviceBadge: string;
    serviceId: string;
}