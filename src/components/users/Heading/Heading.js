import React from "react";
import "./Heading.css";
import leafimg from "./Leaf.png";

const Heading = ({ children }) => {
  return (
    <div className="heading_container">
      <div className="heading_with_leaf">
        <h1>{children}</h1>
        <img src={leafimg} width="24" height="24" alt="" />
      </div>
    </div>
  );
};

export default Heading;
