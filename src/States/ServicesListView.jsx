import React from 'react';
import PropTypes from 'prop-types';
import { ServiceView } from './ServiceView';
import './../styles.css'

function getTotalViewersView(viewers, enabledSourcesCount) {
    if (enabledSourcesCount === 1)
    {
        return (<></>)
    }

    return(
        <span className="serviceIndicator" style={{whiteSpace: "nowrap"}}>
            <img className="bigBadgeServiceIcon" alt="" src={"./images/person.svg"}/>
            <span className="bigText">{viewers > -1 ? viewers.toLocaleString() : "?"}</span>
        </span>
    )
}

function isVisiblePlatform(service, hidePlatformIconIfCountIsUnknown) {
    if (!service) {
        console.warn("service is null");
        return false;
    }

    if (!service.enabled) {
        return false;
    }

    if (service.viewers >= 0) {
        return true;
    }

    return !hidePlatformIconIfCountIsUnknown;
}

function getVisiblePlatformsCount(services, hidePlatformIconIfCountIsUnknown) {
    let result = 0;
    for (let i = 0; i < services.length; i++) {
        if (isVisiblePlatform(services[i], hidePlatformIconIfCountIsUnknown)) {
            result++;
        }
    }
    return result;
}

function getPlatformDisplayStyle(service, hidePlatformIconIfCountIsUnknown) {
    if (isVisiblePlatform(service, hidePlatformIconIfCountIsUnknown)) {
        return "inherit";
    }
    
    return "none";
}

export class ServicesListView extends React.Component {
    static propTypes = {
        services: PropTypes.array.isRequired,
        appState: PropTypes.object.isRequired,
        hidePlatformIconIfCountIsUnknown: PropTypes.bool,
    }

    static defaultProps = {
        services: [],
        appState: null,
        hidePlatformIconIfCountIsUnknown: false,
    }

    render() {
        const appState = this.props.appState;
        const services = this.props.services;
        const hidePlatformIconIfCountIsUnknown = this.props.hidePlatformIconIfCountIsUnknown;
        const visibleCount = getVisiblePlatformsCount(services, hidePlatformIconIfCountIsUnknown);

        return (
            <span>
                {services.map((service, idx) => (
                    <span style={{display: getPlatformDisplayStyle(service, hidePlatformIconIfCountIsUnknown)}}>
                        <ServiceView
                            key={idx}
                            service={service}
                        />
                    </span>
                ))}

                {getTotalViewersView(appState.viewers, visibleCount)}
            </span>
        )
    }
}