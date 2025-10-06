import { createContext } from 'react';

interface SearchParams {
    eventsLogging: boolean;
    wsUrl: string;
    widget: string;
}
export function parseSearchParams(input: URLSearchParams, output: SearchParams) {
    output.eventsLogging = input.get("event-logging") === "true";

    {
        const param = input.get("ws-url");
        if (param) {
            output.wsUrl = param;
        }
    }

    {
        const param = input.get("widget");
        if (param) {
            output.widget = param;
        }
    }
}

interface AppContextInterface {
    searchParams: SearchParams;
}

export const AppContext = createContext<AppContextInterface>({
    searchParams: {
        eventsLogging: false,
        wsUrl: "ws://" + window.location.hostname + ":" + window.location.port + "/",
        widget: "",
    }
});
