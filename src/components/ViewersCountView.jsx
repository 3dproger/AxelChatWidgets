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

        return (
            <span>
                <img alt="" src={service.icon} height="20" align="top" /> {service.viewersCount !== -1 ? service.viewersCount : "?"}
            </span>
        )
    }
}

