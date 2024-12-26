import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Table, Image } from "antd";
import { fetchCombinationById } from "../../../store/productsSlice";
import { useDispatch, useSelector } from "react-redux";
import "./SpecificCombinationsPage.css";

import uparrow from "./uparrow.svg";
import downarrow from "./uparrow.svg";

const SpecificCombinationsPage = () => {

  const dispatch = useDispatch();
  const { apiurl } = useSelector((state) => state.auth);
  const {
    singlecombination,
    singlecombinationloading,
    singlecombiantionerror,
  } = useSelector((state) => state.products);
  const [arrayimgs, setarrayimgs] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(fetchCombinationById({ apiurl, id }));
    }
  }, [dispatch, apiurl, id]);

  useEffect(() => {
    if (!singlecombinationloading) {
      setarrayimgs(
        singlecombination?.images?.map((imageobj) => imageobj.image)
      ); // Correctly return the 'image' field
    }
  }, [singlecombination, dispatch]);

  console.log("arrayimages", arrayimgs);

  const result =
    singlecombination?.items?.map(({ item }, index) => {
      const firstColor = item.product_colors[0]?.color?.name || "No color";
      const itemname = item.product_colors[0]?.product || "No name";
      const firstImage = item.product_colors[0]?.images[0]?.image || "No image";

      const id = item.id;
      const type = item.type;

      const prices = item.product_colors.map((pc) => Number(pc.price) || 0);
      const minPrice = Math.min(...prices);
      const price = `${minPrice}`;

      return {
        key: index,
        firstColor,
        firstImage,
        itemname,
        price,
        id,
        type,
      };
    }) || [];

  const minPrice =
    singlecombination?.items
      ?.flatMap((item) =>
        item.item.product_colors.map((pc) => Number(pc.price) || Infinity)
      )
      .reduce((min, price) => Math.min(min, price), Infinity) || 0;

  const totalPrice =
    singlecombination?.items
      ?.flatMap((item) =>
        item.item.product_colors.map((pc) => Number(pc.price) || 0)
      )
      .reduce((sum, price) => sum + price, 0) || 0;

  const columns = [
    {
      title: "Image",
      dataIndex: "firstImage",
      key: "firstImage",
      render: (image, record) => (
        <Image src={`${apiurl}${image}`} alt="Product" width={80} />
      ),
    },
    {
      title: "Details",
      dataIndex: "itemname",
      key: "itemname",
      render: (text, record) => (
        <div>
            <strong>{record.itemname}</strong>
        </div>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text, record) => (
        <div>
          <strong>
            ₹{record.price}/- Per {record.type === "product" ? "unit" : "meter"}
          </strong>
        </div>
      ),
    },
  ];

  const [imgno, setImgno] = useState(0);

  const handleimges = (idx) => {
    console.log("idx", idx);
    console.log("index", idx);
    setImgno(idx);
  };

  const handleUparrow = () => {
    console.log("imgno", imgno);
    if (imgno > 0) {
      setImgno(imgno - 1);
    } else if (imgno <= 0) {
      setImgno(imgno + arrayimgs.length - 1);
    }
  };
  const handleDownarrow = () => {
    console.log("imgno", imgno);
    if (imgno < arrayimgs.length - 1) {
      setImgno(imgno + 1);
    } else if (imgno >= arrayimgs.length - 1) {
      setImgno(0);
    }
  };

  return (
    <div className="singlecombination_container">
      <div className="images_arrow">
        <div className="images_container">
          {arrayimgs?.map((img, index) => (
            <img
              key={index}
              src={`${apiurl}${img}`}
              className={`nav_imgs ${imgno === index ? "selected_img" : ""}`}
              alt={`Nav ${index}`}
              onClick={() => handleimges(index)}
            />
          ))}
        </div>

        <div className="arrows_container">
          <img src={uparrow} className="arrowimages" onClick={handleUparrow} />
          <img
            src={downarrow}
            className="down_arrow arrowimages"
            onClick={handleDownarrow}
          />{" "}
        </div>
      </div>
      {singlecombination ? (
        <div className="singlecombination_content">
          <div className="singlecombination_left">
            <div className="singlecombination_image">
              <img
                src={`${apiurl}${singlecombination.images?.[imgno]?.image}`}
                alt={singlecombination.combination_name}
              />
            </div>
          </div>
          <div className="singlecombination_table">
            <div className="singlecombination_details">
              <h1>{singlecombination.combination_name}</h1>
              <pre>
                {singlecombination.description || "No description available"}
              </pre>
              <h3>
                Price Range: ₹{minPrice} - ₹{totalPrice}
              </h3>
            </div>
            <Table
              showHeader={false}
              className="Combination_items_table"
              dataSource={result}
              columns={columns}
              pagination={false}
              onRow={(record) => ({
                onClick: () => {
                  window.location.href = `/${record.type}s/${record.id}`;
                },
                style: { cursor: "pointer" },
              })}
            />
          </div>
        </div>
      ) : (
        <p>Loading combination details...</p>
      )}
    </div>
  );
};

export default SpecificCombinationsPage;
