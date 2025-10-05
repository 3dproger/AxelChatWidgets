import { Tag } from "./Interfaces"

interface TagViewProps {
  tag: Tag;
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
