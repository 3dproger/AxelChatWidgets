import { MessageUserTag } from "./Interfaces"

interface TagViewProps {
    tag: MessageUserTag;
}

export function TagView({ tag }: TagViewProps) {
    return (
        <span
            className="tag"
            style={{
                backgroundColor: tag.backgroundColor,
                color: tag.textColor,
            }}
        >
            {tag.text}
        </span>
    );
}
