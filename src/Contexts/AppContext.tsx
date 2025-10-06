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

export interface AppSettings {
    locale: string;
    widgets: {
        hideConnectionStatusWhenConnected: boolean;
        states: {
            hidePlatformIconIfCountIsUnknown: false;
        }
        messages: {
            hideTimeout: number;
            style: object;
            showPlatformIcon: boolean;
        }
    }
}

function getDefaultLocale() {
    if (navigator.languages && navigator.languages.length > 0) {
        return navigator.languages[0];
    }
    
    return navigator.language || 'en';
}

interface AppContextInterface {
    searchParams: SearchParams;
    settings: AppSettings;
}

export const AppContext = createContext<AppContextInterface>({
    searchParams: {
        eventsLogging: false,
        wsUrl: "ws://" + window.location.hostname + ":" + window.location.port + "/",
        widget: "",
    },
    settings: {
        widgets: {
            messages: {
                hideTimeout: 0,
                style: {},
                showPlatformIcon: true,
            },
            states: {
                hidePlatformIconIfCountIsUnknown: false,
            },
            hideConnectionStatusWhenConnected: false,
        },
        locale: getDefaultLocale(),
    }
});
