import React from "react";
import "./Specialdealscard.css";

const Specialdealscard = () => {
  return (
    <div className="Specialdealscard_container">
      <div className="row1">
        <h1>Join our newsletter for Special Deals & Offers
        </h1>
        <p>Register now to get latest updates on promotions & coupons.Dont't worry, we not spam!</p>
      </div>
      <div className="row2">
        <input type="email" placeholder="Enter your Email" />
        <button>subscribe</button>
      </div>
    </div>
  );
};

export default Specialdealscard;
