import React, { useContext } from 'react';
import { PlatformStateView } from './PlatformStateView';
import './../styles.css'
import { AppContext, PlatformState } from '../Contexts/AppContext';

function getTotalViewersView(viewers: number, visiblePlatformsCount: number) {
    if (visiblePlatformsCount === 1) {
        return (<></>)
    }

    return (
        <span className="serviceIndicator" style={{whiteSpace: "nowrap"}}>
            <img className="bigBadgeServiceIcon" alt="" src={"./images/person.svg"}/>
            <span className="bigText">{viewers > -1 ? viewers.toLocaleString() : "?"}</span>
        </span>
    )
}

function isVisiblePlatform(state: PlatformState, hideIfUnknown: boolean) {
    if (!state) {
        console.warn("Platform state is null");
        return false;
    }

    if (!state.enabled) {
        return false;
    }

    if (state.viewers >= 0) {
        return true;
    }

    return !hideIfUnknown;
}

function getVisiblePlatformsCount(states: PlatformState[], hideIfUnknown: boolean) {
    let result = 0;
    for (let i = 0; i < states.length; i++) {
        if (isVisiblePlatform(states[i], hideIfUnknown)) {
            result++;
        }
    }
    return result;
}

function getPlatformDisplayStyle(state: PlatformState, hideIfUnknown: boolean) {
    if (isVisiblePlatform(state, hideIfUnknown)) {
        return "inherit";
    }
    
    return "none";
}

export function PlatformStateListView() {
    const appContext = useContext(AppContext);
    const platformsStates = appContext.hostApp.services;
    const hideIfUnknown = appContext.settings.widgets.states.hidePlatformIconIfCountIsUnknown;
    const visiblePlatformsCount = getVisiblePlatformsCount(platformsStates, hideIfUnknown);
    
    return (
        <span>
            {platformsStates.map((state, idx) => (
                <span style={{display: getPlatformDisplayStyle(state, hideIfUnknown)}}>
                    <PlatformStateView
                        key={idx}
                        platformState={state}
                    />
                </span>
            ))}

            {getTotalViewersView(appContext.hostApp.viewers, visiblePlatformsCount)}
        </span>
    )
}
