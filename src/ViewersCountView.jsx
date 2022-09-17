import React from 'react';
import PropTypes from 'prop-types';

export class ViewersCountView extends React.Component {
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

        if (service.connectionStateType !== "connected") {
            return (
                <span></span>
            )
        }

        return (
            <span>
                <img class="badge" alt="" src={service.icon} height="20"/>
                <span class="text">{service.viewersCount !== -1 ? service.viewersCount : "?"}</span>
            </span>
        )
    }
}

