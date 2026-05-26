import { useContext } from "react";
import { Message } from "../ProtocolInterfaces";
import { AppContext } from "../Contexts/AppContext";
import { MessagesListView } from "./MessagesListView";
import { PlatformStateListView } from "../States/PlatformStateListView";

interface MessagesListWithStateViewProps {
    messages: Message[];
}

export function MessagesListWithStateView({messages}: MessagesListWithStateViewProps) {
    const appContext = useContext(AppContext);

    return (
        <div>
            <MessagesListView messages={messages}/>
            <PlatformStateListView/>
        </div>
    );
}
