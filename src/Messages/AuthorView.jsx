import React from "react";
import PropTypes from "prop-types";
import { TagView } from "./TagView";

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
                    alt=""
                    src={author.serviceBadge}
                />
            </span>

            <img
                className="avatar"
                alt=""
                src={author.avatar}
                height={32}
                width={32}
            />

            <span className="tags">
                {author.leftTags.map((tag, idx) => (
                    <TagView key={idx} tag={tag}/>
                ))}
            </span>

            <span className="badges">
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

            <span className="badges">
                {author.rightBadges.map((badgeUrl, idx) => (
                    <img key={idx} className="badgeRight" alt="" src={badgeUrl}></img>
                ))}
            </span>

            <span className="tags">
                {author.rightTags.map((tag, idx) => (
                    <TagView key={idx} tag={tag}/>
                ))}
            </span>
        </span>
        )
    }
}