import React from 'react';
import PropTypes from 'prop-types';

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

        return (
            <span className="serviceIndicator" style={{whiteSpace: "nowrap"}}>
                <img className="bigBadgeServiceIcon" alt="" src={service.icon}/>
                <span className="bigText">{service.viewers !== -1 ? service.viewers.toLocaleString() : ""}</span>
            </span>
        )
    }
}