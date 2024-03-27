import React from "react";

import PropTypes from "prop-types";

import "./message.css";

const Message = (props) => {
  return (
    <div className={`message-message ${props.rootClassName} `}>
      <div className="message-user-name"></div>
      <div className="message-container">
        <div className="message-container1">
          <div className="message-message1">
            <span className="message-message-text">
              <span className="">You did your job well!</span>
            </span>
          </div>
          <img
            alt={props.profilePictureAlt}
            src={props.profilePictureSrc}
            className="message-profile-picture"
          />
        </div>
        <span className="message-user-name-text">
          <span className="">You</span>
        </span>
      </div>
      <span className="message-time">
        <span className="">09:25 AM</span>
      </span>
    </div>
  );
};

Message.defaultProps = {
  profilePictureSrc: "/external/ellipse3071012-9rcw-200h.png",
  rootClassName: "",
  profilePictureAlt: "Ellipse3071012",
};

Message.propTypes = {
  profilePictureSrc: PropTypes.string,
  rootClassName: PropTypes.string,
  profilePictureAlt: PropTypes.string,
};

export default Message;
