import { MessageContent } from "./Interfaces"

interface ContentViewProps {
    content: MessageContent;
}

export function ContentView({ content }: ContentViewProps) {
    if (!content) {
        return <span>null</span>;
    }

    const type = content.type;
    const className = content.htmlClassName;
    const data = content.data;
    const style = content.style;

    if (type === "text") {
        const text = data.text;
        return <span className={className} style={{...style, "whiteSpace": "pre-line" }}>{text}</span>;
    }
    else if (type === "image") {
        return <img className={className} style={style} alt="" src={data.url}></img>;
    }
    else if (type === "hyperlink") {
        return (
            <span> <a className={className} style={{...style, "whiteSpace": "pre-line" }} href={data.url}>
            <span>{data.text}</span>
            </a> </span>
        );
    }
    else if (type === "html") {
        return <span className={className} style={style} dangerouslySetInnerHTML={{__html: data.html ?? "HTML_IS_NULL"}}/>
    }

    return <div>Unknown content type '{type}'</div>;
}
