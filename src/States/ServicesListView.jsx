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
        <span className="serviceIndicator" >
            <img className="bigBadgeServiceIcon" alt="" src={"./images/person.svg"}/>
            <span className="bigText">{viewers > -1 ? viewers.toLocaleString() : "?"}</span>
        </span>
    )
}

export class ServicesListView extends React.Component {
    static propTypes = {
        services: PropTypes.array.isRequired,
        appState: PropTypes.object.isRequired,
    }

    static defaultProps = {
        services: [],
        appState: null,
    }

    render() {
        const appState = this.props.appState;
        return (
            <span>
                {this.props.services.map((service, idx) => (
                    <ServiceView key={idx} service={service} />
                ))}

                {getTotalViewersView(appState.viewers, appState.enabledCount)}
            </span>
        )
    }
}