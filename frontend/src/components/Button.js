import React from "react";
import "./Button.css";
const Button = ({ text, onClick, className }) => {
  return (
    <button className={`button ${className}`} onClick={onClick}>
      {text}
    </button>
  );
};
// Default props
Button.defaultProps = {
  text: "Click Me",
  className: "",
  onClick: () => console.log("Button clicked"),
};
export default Button;
