import { PlatformState } from "../ProtocolInterfaces"

interface PlatformStateViewProps {
    platformState: PlatformState;
}

export function PlatformStateView({ platformState }: PlatformStateViewProps) {
    if (!platformState) {
        return (
            <div>null</div>
        )
    }

    return (
        <span className="serviceIndicator" style={{whiteSpace: "nowrap"}}>
            <img className="bigBadgeServiceIcon" alt="" src={platformState.icon}/>
            <span className="bigText">{platformState.viewers !== -1 ? platformState.viewers.toLocaleString() : ""}</span>
        </span>
    )
}
