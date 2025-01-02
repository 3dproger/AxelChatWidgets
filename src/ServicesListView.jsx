import React from 'react';
import PropTypes from 'prop-types';
import './styles.css'

export class ServiceView extends React.Component {
    static propTypes = {
        service: PropTypes.object.isRequired,
    }

    static defaultProps = {
        service: null,
    }
    
    render() {
        const service = this.props.service;

        if (!service) {
            return (
                <div>null</div>
            )
        }

        if (!service.enabled) {
            return (
                <span></span>
            )
        }

        return (
            <span className="serviceIndicator">
                <img className="badgeServiceIcon" alt={service.type_id + "-icon"} src={service.icon}/>
                <span className="text">{service.viewers !== -1 ? service.viewers.toLocaleString() : ""}</span>
            </span>
        )
    }
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
        return (
            <div>
                {this.props.services.map((service, idx) => (
                    <ServiceView key={idx} service={service} />
                ))}
                <span className="serviceIndicator">
                    <img className="badgeServiceIcon" alt="viewers-count" src={"./images/person.svg"}/>
                    <span className="text">{this.props.appState.viewers > -1 ? this.props.appState.viewers.toLocaleString() : "?"}</span>
                </span>
            </div>
        )
    }
}