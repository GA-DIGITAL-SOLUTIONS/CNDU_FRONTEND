import React, { useEffect, useState } from "react";
import { fetchProducts, fetchCombinations } from "../../../store/productsSlice";
import { useDispatch, useSelector } from "react-redux";
import "./Combination.css";
import { Link } from "react-router-dom";
import Heading from "../Heading/Heading";
import banner from "./productpageBanner.png";
import Loader from "../../Loader/Loader";

const Combinations = () => {
  const dispatch = useDispatch();
  const { Combinations, loadingcombinations } = useSelector(
    (state) => state.products
  );
  const { apiurl, access_token } = useSelector((state) => state.auth);
  const [combinationfetched, setcombinationsfetched] = useState(false);
  const [Combos, Setcombos] = useState([]);

  useEffect(() => {
    const pros = Combinations?.filter((product) => {
      return product?.combination_is_active;
    });

    Setcombos(pros);
  }, [Combinations]);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCombinations())
      .unwrap()
      .then(() => {
        setcombinationsfetched(true);
      });
  }, [dispatch]);

  return (
    <>

<div className="products-page" style={{ position: "relative" }}>
      {loadingcombinations && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            backgroundColor: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <Loader />
        </div>
      )}
      <img
        src={banner}
        alt="banner"
        className="combinationBanner"
        style={{ width: "100vw" }}
      />
      <div className="combinationContainer">
        <Heading>Combos</Heading>
        <div className="combination-cards-container">
          {Combos?.map((comb) => {
            const firstImage = comb.images?.[0]?.image;
            return (
              <div key={comb.id} className="combination-card">
                {firstImage ? (
                  <Link to={`/combinations/${comb.id}`}>
                    <img
                      className="combination-card-image"
                      src={`${apiurl}${firstImage}`}
                      alt={comb.combination_name}
                    />
                  </Link>
                ) : (
                  <div className="combination-card-placeholder">
                    <p>No image available</p>
                  </div>
                )}
                <div className="combination-card-details">
                  <h2 className="combination-card-title">
                    <Link
                      style={{
                        color: "inherit",
                        textDecoration: "none",
                        display: "inline-block",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "150px",
                      }}
                      to={`/combinations/${comb.id}`}
                    >
                      {comb.combination_name}
                    </Link>
                  </h2>
                </div>
              </div>
            );
          })}
        </div>
      </div>

				
			</div>
    </>
  );
};

export default Combinations;
