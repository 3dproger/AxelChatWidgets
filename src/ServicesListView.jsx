import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import StyledBadge from "@mui/material/Badge"

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
            <span>
                <StyledBadge
                    color={service.connection_state === "connected" ? "success" : "error"}
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot"
                    >
                    <Avatar alt="" variant="square" src={"./images/" + service.type_id + "-icon.svg"}/>
                </StyledBadge>
                <span className="text">{service.viewers !== -1 ? service.viewers : ""}</span>
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
            <div align="middle">
                {this.props.services.map((service, idx) => (
                    <ServiceView key={idx} service={service} />
                ))}
                <Avatar alt="" variant="square" src="./images/viewer.svg"/>
                <span className="text">{this.props.appState.viewers > -1 ? this.props.appState.viewers : "?"}</span>
            </div>
        )
    }
}