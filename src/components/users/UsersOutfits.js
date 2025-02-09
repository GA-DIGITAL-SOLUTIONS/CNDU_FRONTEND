

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOutfits } from "../../store/OutfitSlice";
import { useNavigate } from "react-router-dom";
import {  Carousel } from "antd";

const UsersOutfits = () => {
  const { apiurl } = useSelector((state) => state.auth);
  const { outfits } = useSelector((state) => state.outfits);
  // console.log(outfits)
  const dispatch = useDispatch();
  const Navigate = useNavigate();

  useEffect(() => {
      dispatch(fetchOutfits({ apiurl }));
  }, [dispatch, apiurl]);

  if (!outfits || outfits.length === 0) {
    return <div>No outfits available</div>;
  }
  return (
    <div>
      {/* Display outfits list */}
      {outfits.map((o) => (
        <ul key={o.id}>
          <li>Combination Name: {o.combination_name}</li>

          {/* Carousel for Saree Images */}
          <div style={{ maxWidth: "400px", margin: "0 auto" }}>
            <Carousel dots={false} arrows={true}>
              {/* Saree 1 Image */}
              <div>
                <img
                  src={`${apiurl}/${o.combination_image}`}
                  alt="Combination"
                  style={{ width: "100%", height: "auto", objectFit: "cover" }}
                />
              </div>

              <div>
                <img
                  src={`${apiurl}/${o.outfit_1.image}`}
                  alt={o.outfit_1.name}
                  style={{ width: "100%", height: "auto", objectFit: "cover" }}
                />
              </div>

              <div>
                <img
                  src={`${apiurl}/${o.outfit_2.image}`}
                  alt="Saree 2"
                  style={{ width: "100%", height: "auto", objectFit: "cover" }}
                />
                <h5>{o.outfit_1.name}</h5>
              </div>
            </Carousel>
          </div>
        </ul>
      ))}

      {/* Button to add new outfit */}
      <button onClick={() => Navigate('/addoutfit')}>ADD OUTFIT</button>
    </div>
  );
};

export default UsersOutfits;
