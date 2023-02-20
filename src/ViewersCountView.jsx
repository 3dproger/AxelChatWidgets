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

        if (!service.enabled) {
            return (
                <span></span>
            )
        }

        return (
            <span>
                <img class="badge" alt="" src={"./images/" + service.type_id + "-icon.svg"} height="20"/>
                <span class="text">{service.viewers !== -1 ? service.viewers : ""}</span>
            </span>
        )
    }
}

