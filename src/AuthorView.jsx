import React from "react";
import PropTypes from "prop-types";

export class AuthorView extends React.Component {
    static propTypes = {
        author: PropTypes.object.isRequired,
    };

    static defaultProps = {
        author: null,
    };

    render() {
        const author = this.props.author;

        if (!author) {
            return <span className="null_author">NULL_AUTHOR</span>;
        }

        return (
        <span className="author">
            <span className="badges">
                <img
                    className="badgeServiceIcon"
                    alt={author.serviceId + "-badge"}
                    src={author.serviceBadge}
                />

                {author.leftBadges.map((badgeUrl, idx) => (
                    <img key={idx} className="badgeLeft" alt="" src={badgeUrl}></img>
                ))}
            </span>

            <span
                className={"authorName" + (author.customBackgroundColor.length  > 0 ? " authorNameCustomBackgroundColor" : "")}
                style={{
                    "color": author.color,
                    "backgroundColor": author.customBackgroundColor,
                }}>
                {author.name}
            </span>

            {author.rightBadges.map((badgeUrl, idx) => (
                <img key={idx} className="badgeRight" alt="" src={badgeUrl}></img>
            ))}
        </span>
        )
    }
}