import React from 'react';
import PropTypes from 'prop-types';
import { ServiceView } from './ServiceView';
import './styles.css'

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