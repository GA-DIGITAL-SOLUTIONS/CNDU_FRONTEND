// import React from "react";
// import silver from "./silvercoin.png";
// import "./Sale.css"; // import css file

// const Sale = ({ amount }) => {
//   const today = new Date();

//   // Define the start and end dates for the condition
//   const startDate = new Date(today.getFullYear(), 8, 5, 0, 0, 0); // Sept 5
//   const endDate = new Date(today.getFullYear(), 8, 15, 23, 59, 59); // Sept 15

//   // Check if today is within the range
//   const isBetween = today >= startDate && today <= endDate;

//   if (!isBetween) return null;

//   const threshold = 500; // only show "add more" if within ₹500

//   if (amount >= 2000) {
//     const coins = Math.floor(amount / 2000);
//     const nextTarget = (coins + 1) * 2000;
//     const needed = nextTarget - amount;

//     return (
//       <div className="sale-container">
//         <img src={silver} alt="Silver Coin" className="coin-img" />
//         <div>
//           <p className="sale-main-text">
//             🎉 Congratulations! You have earned{" "}
//             <span className="highlight">
//               {coins} silver {coins > 1 ? "coins" : "coin"}{" "}
//               ({coins > 1 ? "1g each" : "1g"})
//             </span>
//             !
//           </p>

//           {needed > 0 && needed <= threshold && (
//             <p className="sale-sub-text">
//               Add items worth ₹{needed} more to get{" "}
//               <strong>
//                 {coins + 1} silver {coins + 1 > 1 ? "coins" : "coin"} (
//                 {coins + 1 > 1 ? "1g each" : "1g"})
//               </strong>
//             </p>
//           )}
//         </div>
//       </div>
//     );
//   }

//   // Case: amount below 2000 (close to first milestone)
//   const needed = 2000 - amount;
//   if (needed > 0 && needed <= threshold) {
//     return (
//       <div className="sale-container">
//         <img src={silver} alt="Silver Coin" className="coin-img" />
//         <p className="sale-sub-text">
//           Add items worth ₹{needed} more to earn{" "}
//           <strong>1 silver coin (1g)</strong> 
//         </p>
//       </div>
//     );
//   }

//   return null;
// };

// export default Sale;




import React from "react";
import silver from "./silvercoin.png";
import "./Sale.css"; // import css file

const Sale = ({ amount }) => {
  const today = new Date();

  // Define the start and end dates for the condition
  const startDate = new Date(today.getFullYear(), 8, 5, 0, 0, 0); // Sept 5
  const endDate = new Date(today.getFullYear(), 8, 15, 23, 59, 59); // Sept 15

  // Check if today is within the range
  const isBetween = today >= startDate && today <= endDate;

  if (!isBetween) return null;

  const threshold = 500; // only show "add more" if within ₹500
  const milestone = 2000;

  const coins = Math.floor(amount / milestone);
  const nextTarget = (coins + 1) * milestone;
  const needed = nextTarget - amount;

  return (
    <div className="sale-container">
      <img src={silver} alt="Silver Coin" className="coin-img" />
      <div>
        {coins > 0 ? (
          <p className="sale-main-text">
            🎉 Congratulations! You have earned{" "}
            <span className="highlight">
              {coins} silver {coins > 1 ? "coins" : "coin"}{" "}
              ({coins > 1 ? "1g each" : "1g"})
            </span>
            !
          </p>
        ) : null}

        {/* Show "Add more" if user is within threshold of the next milestone */}
        {needed > 0 && needed <= threshold && (
          <p className="sale-sub-text">
            Add items worth ₹{needed} more to get{" "}
            <strong>
              {coins + 1} silver {coins + 1 > 1 ? "coins" : "coin"} (
              {coins + 1 > 1 ? "1g each" : "1g"})
            </strong>
          </p>
        )}
      </div>
    </div>
  );
};

export default Sale;



