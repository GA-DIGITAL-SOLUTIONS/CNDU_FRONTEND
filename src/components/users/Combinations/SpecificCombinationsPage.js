import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Table, Image } from "antd";
import { fetchCombinationById } from "../../../store/productsSlice";
import { useDispatch, useSelector } from "react-redux";
import "./SpecificCombinationsPage.css";
import { Link } from "react-router-dom";
const SpecificCombinationsPage = () => {
  const dispatch = useDispatch();
  const { apiurl } = useSelector((state) => state.auth);
  const { singlecombination } = useSelector((state) => state.products);

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(fetchCombinationById({ apiurl, id }));
    }
  }, [dispatch, apiurl, id]);

  console.log("singlecombination", singlecombination);

  // Prepare data for the table
  const result = singlecombination?.items?.map(({ item }, index) => {
    const firstColor = item.product_colors[0]?.color?.name || "No color";
    const itemname = item.product_colors[0]?.product || "No name";
    const firstImage = item.product_colors[0]?.images[0]?.image || "No image";
    console.log("iiiiii", item);
  
    const id = item.id;
    const type = item.type;
  
    // Calculate min and max prices from the product_colors array
    const prices = item.product_colors.map((pc) => pc.price || 0);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const price = `${minPrice}-${maxPrice}`;
  
    return {
      key: index,
      firstColor,
      firstImage,
      itemname,
      price, // Use calculated price range
      id,
      type,
    };
  }) || [];
  
  console.log(result);  
  // Table columns
  const columns = [
    {
      dataIndex: "firstImage",
      key: "firstImage",
      render: (image,record) => (
        <div style={{width:"200px"}}>
          <Link to={`/${record.type}s/${record.id}`}>
        <Image src={`${apiurl}${image}`} alt="Product" width={80} />
        </Link>
        </div>
      )
    },
    {
      dataIndex: "itemname",
      key: "itemname",
      render: (text, record) => (
        <div style={{width:"200px"}}>
          <strong>{record.itemname}</strong>
          <br />
          <span style={{ color: "#888" }}>{record.firstColor}</span>
          <span style={{ color: "#888" }}>{record.id}</span>
        </div>
      )
    },
    {
      dataIndex: "price",
      key: "price",
      render:(price)=>(
        <h4>₹{price}</h4>

      )
    }
  ];

  return (
    <div className="singlecombination_container">
      {singlecombination ? (
        <>
          <div className="singlecombination_image">
            <h1>{singlecombination.combination_name}</h1>
            <img
              style={{ width: "350px" }}
              src={`${apiurl}${singlecombination.images?.[0]?.image}`}
              alt={singlecombination.combination_name}
            />
          </div>
          <div className="Combination_items">
            <Table
            className="Combination_items_table"
            style={{ height: "100%", margin: "0 auto" }}
              dataSource={result}
              columns={columns} 
              pagination={false}
              width={50}
            />
          </div>
        </>
      ) : (
        <p>Loading combination details...</p>
      )}
    </div>
  );
};

export default SpecificCombinationsPage;
