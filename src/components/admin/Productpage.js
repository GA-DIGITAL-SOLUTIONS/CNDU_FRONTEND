import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, Breadcrumb } from "antd";
import { deleteProduct, fetchProducts } from "../../store/productsSlice";
import { Link } from "react-router-dom";
import Main from "./AdminLayout/AdminLayout";
import Loader from "../Loader/Loader";
import uparrow from "./images/uparrow.svg";
import downarrow from "./images/uparrow.svg";
import { useLocale } from "antd/es/locale";

const { Meta } = Card;

const ProductPage = () => {
  const dispatch = useDispatch();

  const Navigate = useNavigate();
  const { id } = useParams();

  const [singleFabric, setSingleFabric] = useState([]);
  const [colorsizes, setColorSizes] = useState([]);

  const location =useLocation();

  // console.log("location ",location.state?.from )

  const { fabrics } = useSelector((state) => state.products);

  const [imgno, setimgno] = useState(0);
  const [arrayimgs, setarrayimgs] = useState([]);
  const [productColorId, selectProductColorId] = useState(null);
  const [selectedColorid, setselectedColorid] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  const [productColorPrice, selectProductColorPrice] = useState(null);
  const [varientProductColorDiscount,SetVarientProductColorDiscount] = useState(null);
  const [discountPercentage,setDiscountPercentage]=useState(null);

  const { apiurl, access_token } = useSelector((state) => state.auth);
  const [sizesOfEachColor, setSizesofEachColor] = useState([]);
  const [colorObj, SetColorOBj] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFabricdata({ id, apiurl });
  }, [id]);

  const fetchFabricdata = async ({ id, apiurl }) => {
    try {
      setLoading(true);
      const response = await fetch(`${apiurl}/products/${id}`);
      if (!response.ok) {
        setLoading(false);
        const errorData = await response.json();
        throw new Error(errorData.msg || "Network response was not ok");
      }
      const data = await response.json();
      setLoading(false);
      setSingleFabric(data);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching fabric:", error.msg);
      throw error;
    }
  };

  useEffect(() => {
    if (singleFabric.product_colors && singleFabric.product_colors.length > 0) {
      const firstColorId = singleFabric.product_colors[0].color.id;
      handleColorSelect(firstColorId);
      selectProductColorId(singleFabric.product_colors[0].id);
      selectProductColorPrice(singleFabric?.product_colors[0]?.price);
      SetVarientProductColorDiscount(singleFabric?.product_colors[0]?.color_discounted_amount_each);
      setDiscountPercentage(singleFabric?.product_colors[0]?.discount_percentage)

      setSelectedSize(singleFabric.product_colors[0].size);
      const colorSizes = singleFabric?.product_colors.reduce((acc, obj) => {
        const colorId = obj.color.id;

        if (colorId) {
          acc.push({
            colorId: colorId,
            sizecolorid: obj.id,
            size: obj.size,
          });
        }

        return acc;
      }, []);

      setColorSizes(colorSizes);
    }
  }, [singleFabric?.product_colors, , id, dispatch]);

  useEffect(() => {
    const eachcolorsizes = colorsizes.filter(
      (obj) => obj.colorId == selectedColorid
    );
    setSizesofEachColor(eachcolorsizes);
  }, [selectedColorid, colorsizes]);

  useEffect(() => {
    if (singleFabric?.category?.name?.toLowerCase() == "dresses") {
      const selectedSizeId = sizesOfEachColor.filter(
        (obj) => obj.colorId == selectedColorid
      );
      selectProductColorId(selectedSizeId[0]?.sizecolorid);
      setSelectedSize(selectedSizeId[0]?.size);
    }
  }, [sizesOfEachColor]);

  useEffect(() => {
    // console.log(
    // 	"selectedSize price ",
    // 	colorObj?.price,
    // 	"discounted price ",
    // 	colorObj?.discount_price
    // );

    selectProductColorPrice(colorObj?.price);
    SetVarientProductColorDiscount(colorObj?.color_discounted_amount_each);
    setDiscountPercentage(colorObj?.discount_percentage)

  }, [selectedSize, colorObj]);

  useEffect(() => {
    if (singleFabric?.category?.name.toLowerCase() == "dresses") {
      const filterobj = singleFabric?.product_colors?.filter((obj) => {
        // console.log("obj.size", obj.size);
        // console.log("selectedSize",selectedSize)
        // console.log("obj.size",obj.size)

        if (productColorId == obj.id) {
          return obj;
        }
      });
      const allImages =
        filterobj
          ?.map((obj) => obj.images.map((imgobj) => imgobj.image))
          .flat() || [];
      setarrayimgs(allImages);
    }
    const selectedCOLOROBj = singleFabric?.product_colors?.find(
      (obj) => obj.id === productColorId
    );
    SetColorOBj(selectedCOLOROBj);
  }, [productColorId]);

  const [colorQuentity, setcolorQuentity] = useState(null);

  const handlemoveedit = () => {
    Navigate(`/inventory/product/${singleFabric?.id}/edit`);
  };

  const handleDelete = () => {
    dispatch(deleteProduct({ id, access_token }))
      .unwrap()
      .then(() => {
        dispatch(fetchProducts());
        // Navigate("/inventory");
        window.history.back();
      })
      .catch((error) => console.error("Error deleting product:", error));
  };

  const handleUparrow = () => {
    if (imgno > 0) {
      setimgno(imgno - 1);
    } else if (imgno <= 0) {
      setimgno(imgno + arrayimgs.length - 1);
    }
  };

  const handleDownarrow = () => {
    if (imgno < arrayimgs.length - 1) {
      setimgno(imgno + 1);
    } else if (imgno >= arrayimgs.length - 1) {
      setimgno(0);
    }
  };
  const handleimges = (idx) => {
    setimgno(idx);
  };

  const handleColorSelect = (id) => {
    setselectedColorid(id);
    const selectedColorObj = singleFabric.product_colors.find(
      (obj) => obj.color.id === id
    );
    if (selectedColorObj) {
      const imagesurls = selectedColorObj.images.map((imageobj) => {
        return imageobj.image;
      });
      setarrayimgs(imagesurls);
      setcolorQuentity(selectedColorObj.stock_quantity);
      selectProductColorId(selectedColorObj.id);
      selectProductColorPrice(selectedColorObj?.price);
      SetVarientProductColorDiscount(selectedColorObj?.color_discounted_amount_each);
      setDiscountPercentage(selectedColorObj?.discount_percentage)


    }
  };

  const handleSizeClick = (size, sizecolorid) => {
    selectProductColorId(sizecolorid);
    setSelectedSize(size);
  };

  if (loading) {
    return (
      <Main>
        <Loader />
      </Main>
    );
  }

  return (
    <Main>
      <div className="specific_product_page">
        <div className="product_imgs_detail_container">
          <div className="right-main">
            <div className="imgs_navigator">
              <div className="only_img">
                {arrayimgs.map((img, index) => (
                  <img
                    key={index}
                    src={`${apiurl}${img}`}
                    className={`nav_imgs ${
                      imgno === index ? "selected_img" : ""
                    }`}
                    alt={`Nav ${index}`}
                    onClick={() => handleimges(index)}
                  />
                ))}
              </div>

              <div className="arrows">
                <img alt="arrow" src={uparrow} onClick={handleUparrow} />
                <img
                  alt="arrow"
                  className="rotate-img"
                  src={downarrow}
                  onClick={handleDownarrow}
                />
              </div>
            </div>
            <div className="spec-prod-img">
              <img
                src={`${apiurl}${arrayimgs[imgno]}`}
                alt="productimage"
                className="pro_image"
              />
              <Button
                className="sp-prd-heartbtn"
                style={{ backgroundColor: "gray", color: "white" }}
              >
                {}
              </Button>
            </div>
          </div>

          <div className="details_container">
            <Breadcrumb
              separator=">"
              items={[
                {
                  title: <Link to="/inventory">Inventory</Link>,
                },

                {
                  title: <>{singleFabric.name}</>,
                },
              ]}
            />
            <h2 className="heading">{singleFabric.name}</h2>

            {singleFabric?.product_colors &&
              singleFabric?.product_colors.length > 0 && (
                <h2 className="heading">
                {Number(varientProductColorDiscount)== 0  ? (
                  <>₹{Number(productColorPrice)}{" "}</> // Show productColorPrice when no discount
                ) : (
                  <>
                    <span style={{ textDecoration: 'line-through' ,marginRight:"10px"}}>₹{Number(productColorPrice)} </span>
                    ₹{Number(varientProductColorDiscount)}{" "} {/* Show the discounted price */}
                  </>
                )}
              
                {singleFabric?.category?.name === "Fabrics" && <span>per meter</span>}
              </h2>
              )}

            <div className="rating_and_comments">
              <div className="rating"></div>
            </div>

            <h2 className="colors_heading">Colours Available</h2>

            <div
              className="colors_container"
              style={{ display: "flex", gap: "10px" }}
            >
              {singleFabric.product_colors &&
                Array.from(
                  new Map(
                    singleFabric.product_colors.map((obj) => [
                      obj.color.id,
                      obj,
                    ])
                  ).values()
                ).map((obj) => (
                  <div
                    key={obj.color.id}
                    onClick={() => handleColorSelect(obj.color.id)}
                    style={{
                      width: "30px",
                      height: "30px",
                      backgroundColor: obj?.color?.hexcode,
                      cursor: "pointer",
                      borderRadius: "50px",
                      border:
                        selectedColorid === obj.color.id
                          ? "2px solid #F24C88"
                          : "",
                    }}
                  >
                    {}
                  </div>
                ))}
            </div>
            {singleFabric?.category?.name.toLowerCase() == "dresses" && (
              <div style={{ marginTop: "20px" }}>
                <strong>Size:{selectedSize}</strong>
                <h4>Available Sizes:</h4>
                <div style={{ display: "flex", gap: "10px" }}>
                  {sizesOfEachColor?.map((obj, index) => (
                    <div
                      key={index}
                      onClick={() =>
                        handleSizeClick(obj?.size, obj?.sizecolorid)
                      } // Handle click event
                      style={{
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        cursor: "pointer",
                        backgroundColor:
                          selectedSize == obj?.size &&
                          obj?.sizecolorid == productColorId
                            ? "black"
                            : "#f9f9f9",
                        color:
                          selectedSize == obj?.size &&
                          obj?.sizecolorid == productColorId
                            ? "white"
                            : "black",
                      }}
                    >
                      {obj?.size}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="measers">
              <h4>Leangth:{singleFabric.length} / centimeters</h4>
              <h4>breadth:{singleFabric.breadth} / centimeters</h4>
              <h4>height :{singleFabric.height} / centimeters</h4>
            </div>

            <div className="cart_quentity">
              <Button primary onClick={handlemoveedit}>
                Update
              </Button>
              <Button danger onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>

        <div className="product_description">
          <h2>Description</h2>
          <div
            className="desc-content"
            dangerouslySetInnerHTML={{
              __html: singleFabric.description,
            }}
          ></div>
        </div>
      </div>
    </Main>
  );
};

export default ProductPage;
