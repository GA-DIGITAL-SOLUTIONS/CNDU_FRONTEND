import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from "../../store/productsSlice";

const Productpage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { singleproduct, singleproductloading, singleproducterror } = useSelector((state) => state.products);
  // console.log("singlepro", singleproduct);

  const {apiurl}=useSelector((state)=>state.auth)
  const url=apiurl
  useEffect(() => {
    dispatch(fetchProductById({id,url}));
  }, [dispatch, id]);

  if (singleproductloading) {
    return <div>Loading....</div>;
  } else if (singleproducterror) {
    return <div>Error: {singleproducterror}</div>;
  }

  return (
    <div>
      <h1>Product: {id}</h1>
      <h1>{singleproduct.name}</h1>
      <p>{singleproduct.price}</p>
      {singleproduct.colors && singleproduct.colors.length > 0 ? (
        <ul>
          {singleproduct.colors.map((color) => (
            <li key={color.id}>{color.name}</li>
          ))}
        </ul>
      ) : (
        <p>No colors available</p>
      )}
    </div>
  );
};

export default Productpage;
