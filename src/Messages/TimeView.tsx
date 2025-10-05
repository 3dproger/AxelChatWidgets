interface TimeViewProps {
    timeIso: string;
}

export function TimeView({ timeIso }: TimeViewProps) {
    const date = new Date(timeIso);
    const dateText = date.toLocaleDateString();
    const timeText = date.toLocaleTimeString();

    return (<span>
        <span className="time">{timeText}</span>
        <span className="date">{dateText}</span>
    </span>);
}
