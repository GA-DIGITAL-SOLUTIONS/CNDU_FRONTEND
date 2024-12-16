// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   Button,
//   Card,
//   Col,
//   Row,
//   Modal,
//   Form,
//   Input,
//   Select,
//   Space,
//   InputNumber,
//   Upload,
//   Checkbox,
// } from "antd";
// import { UploadOutlined } from "@ant-design/icons";
// import {
//   deleteProduct,
//   fetchProducts,
//   updateProduct,
// } from "../../store/productsSlice";
// import { Link } from "react-router-dom";
// import Main from "./AdminLayout/AdminLayout";
// import { fetchColors } from "../../store/colorsSlice";
// import { fetchCategory } from "../../store/catogerySlice";
// import Loader from "../Loader/Loader";

// const { Meta } = Card;


// const ProductPage = () => {

  
//   const navigate = useNavigate();
//   const { access_token, apiurl } = useSelector((state) => state.auth);
//   const [singleproduct, setSingleProduct] = useState({});
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const { loading, error } = useSelector((state) => state.products);
//   const [colorFields, setColorFields] = useState([]);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [form] = Form.useForm();

//   useEffect(() => {
//     fetchProductId({ id, apiurl });
//   }, [id, apiurl]);

//   useEffect(() => {
//     dispatch(fetchColors({ apiurl }));
//     dispatch(fetchCategory({ apiurl }));
//   }, [dispatch, apiurl]);

//   useEffect(() => {
//     if (singleproduct) {
//       singleproduct.product_colors?.map((color) => {
//         console.log("id", color.color.id);
//       });
//       const initialColors = singleproduct.product_colors?.map((color) => ({
//         color_id: color.color.id,
//         stock_quantity: color.stock_quantity,
//         price: color.price,
//         images: color.images.map((image) => ({
//           uid: image.id,
//           name: image.image.split("/").pop(),
//           url: `${apiurl}${image.image}`,
//           originFileObj: null,
//         })),
//       }));

//       setColorFields(initialColors || []);

//       form.setFieldsValue({
//         name: singleproduct.name,
//         category_id: singleproduct.category?.id || null,
//         weight: singleproduct.weight || null,
//         colors: initialColors,
//         is_special_collection: singleproduct.is_special_collection || false,
//         description: singleproduct.description || "",
//       });
//     }
//   }, [singleproduct, apiurl, form]);

//   const fetchProductId = async ({ id, apiurl }) => {
//     try {
//       const response = await fetch(`${apiurl}/products/${id}`);
//       if (!response.ok) {
//         throw new Error(`Error: ${response.status} - ${response.statusText}`);
//       }
//       const data = await response.json();
//       setSingleProduct(data);
//     } catch (err) {
//     } finally {
//     }
//   };

//   const { havingcolors, colorsloading, colorserror } = useSelector(
//     (state) => state.colors
//   );
//   const { categories, categoriesloading, categoriesserror } = useSelector(
//     (state) => state.categories
//   );

//   if (!colorsloading) {
//     console.log("colors", havingcolors);
//   } else {
//     console.log("colorserror", colorserror);
//   }

//   if (!categoriesloading) {
//     console.log("categories", categories);
//   } else if (categoriesserror) {
//     console.log("colorserror", categoriesserror);
//   }

//   if (categoriesloading) {
//     return <Loader />;
//   }

//   if (colorsloading) {
//     return <Loader />;
//   }

//   const handleEdit = () => setIsModalVisible(true);
//   const handleCancel = () => setIsModalVisible(false);

//   const handleColorChange = (value, field, index) => {
//     const updatedColors = [...colorFields];
//     updatedColors[index][field] = value;
//     setColorFields(updatedColors);
//   };

//   const handleAddColor = () => {
//     setColorFields([
//       ...colorFields,
//       { color_id: null, stock_quantity: 0, price: 0, images: [] },
//     ]);
//   };

//   const handleRemoveColor = (index) => {
//     const updatedColors = [...colorFields];
//     updatedColors.splice(index, 1);
//     setColorFields(updatedColors);
//   };

//   const handleImageChange = (e, index) => {
//     const updatedColors = [...colorFields];
//     updatedColors[index].images = e.fileList;
//     setColorFields(updatedColors);
//   };

//   const handleUpdateProduct = () => {
//     form.validateFields().then(async (values) => {
//       const formData = new FormData();

//       formData.append("name", values.name);
//       formData.append("category_id", values.category_id);
//       formData.append("weight", values.weight);
//       formData.append("is_special_collection", values.is_special_collection);
//       formData.append("description", values.description);

//       const colors = await Promise.all(
//         colorFields.map(async (color, index) => {
//           const imageFiles = await Promise.all(
//             color.images.map(async (image) => {
//               if (image.originFileObj) {
//                 return image.originFileObj;
//               } else if (image.url) {
//                 const response = await fetch(image.url);
//                 const blob = await response.blob();
//                 return new File(
//                   [blob],
//                   image.name || `existing_image_${index}`,
//                   { type: blob.type }
//                 );
//               }
//               return null;
//             })
//           );

//           imageFiles.forEach((file, idx) => {
//             if (file) formData.append(`images_${color.color_id}`, file);
//           });

//           return {
//             color_id: color.color_id,
//             stock_quantity: color.stock_quantity,
//             price: color.price,
//           };
//         })
//       );

//       formData.append("colors", JSON.stringify(colors));

//       dispatch(updateProduct({ id, formData, access_token }))
//         .unwrap()
//         .then(() => {
//           setIsModalVisible(false);
//           console.log("Product updated successfully");
//         })
//         .catch((error) => console.error("Error updating product:", error));
//     });
//   };

//   const handleDelete = () => {
//     dispatch(deleteProduct({ id, access_token }))
//       .unwrap()
//       .then(() => {
//         console.log("Product deleted successfully");
//         dispatch(fetchProducts());
//         navigate("/inventory");
//       })
//       .catch((error) => console.error("Error deleting product:", error));
//   };

//   if (loading) return <p>Loading product details...</p>;
//   if (error) return <p>Error: {error}</p>;

//   const primaryImage = singleproduct.product_colors?.find(
//     (colorObj) => colorObj.images.length > 0
//   )?.images[0]?.image;

// 	const handlemoveedit=()=>{
// 		navigate(`/inventory/product/${singleproduct.id}/edit`)
// 	}

//   return (
//     <Main>
//       <h1>Product page</h1>
//       <Row gutter={[16, 16]}>
//         <Col key={singleproduct.id} xs={24} sm={12} md={8} lg={6}>
//           <Card hoverable>
//             <Link to={`/inventory/product/${singleproduct.id}`}>
//               {}
//               <img
//                 src={`${apiurl}${primaryImage}`}
//                 alt={singleproduct.name}
//                 style={{
//                   width: "100%",
//                   height: "200px",
//                   objectFit: "cover",
//                 }}
//               />
//             </Link>
//             <Card.Meta
//               title={
//                 <Link to={`/inventory/product/${singleproduct.id}`}>
//                   {singleproduct.name}
//                 </Link>
//               }
//               description={
//                 <>
//                   <p>Category: {singleproduct.category?.name || "N/A"}</p>
//                   {singleproduct.sub_category?.name && (
//                     <p>Sub-category: {singleproduct.sub_category.name}</p>
//                   )}
//                   <p>Available Colors:</p>
//                   <ul>
//                     {singleproduct.product_colors?.map((colorObj) => (
//                       <li key={colorObj.id}>
//                         <strong>{colorObj.color.name}</strong> - Price: ₹
//                         {colorObj.price}, Stock: {colorObj.stock_quantity}
//                         -images-{colorObj.images.length}
//                         {colorObj.images?.map((image, index) => (
//                           <div key={image.id || `${colorObj.id}-${index}`}>
//                             <img
//                               src={`${apiurl}${image.image}`}
//                               alt={`${singleproduct.name}-color:${colorObj.color.name} `}
//                               style={{
//                                 width: "25%",
//                                 height: "auto",
//                                 objectFit: "cover",
//                               }}
//                             />
//                           </div>
//                         ))}
//                       </li>
//                     ))}
//                   </ul>
//                 </>
//               }
//             />
//             <Button
//               type="primary"
//               onClick={handlemoveedit}
//               style={{ marginRight: "10px" }}
//             >
//               Edit
//             </Button>
//             <Button type="danger" danger onClick={handleDelete}>
//               Delete
//             </Button>
//           </Card>
//         </Col>
//       </Row>

//       <Modal
//         title="Edit Product"
//         visible={isModalVisible}
//         onOk={handleUpdateProduct}
//         onCancel={handleCancel}
//       >
//         <Form form={form} layout="vertical">
//           <Form.Item
//             name="name"
//             label="Product Name"
//             rules={[
//               { required: true, message: "Please input the product name!" },
//             ]}
//           >
//             <Input />
//           </Form.Item>
//           <Form.Item
//             name="category_id"
//             label="Category"
//             rules={[{ required: true, message: "Please select a category!" }]}
//           >
//             <Select placeholder="Select a category">
//               <Select.Option value={3}>Fabrics</Select.Option>
//               <Select.Option value={4}>Sarees</Select.Option>
//             </Select>
//           </Form.Item>

//           <Form.Item
//             name="weight"
//             label="Weight(in grams)"
//             className="form-item"
//             rules={[
//               {
//                 required: true,
//                 message: "Please enter the weight of the product!",
//               },
//             ]}
//           >
//             <InputNumber min={50} step={0.5} />
//           </Form.Item>

//           <Form.Item name="is_special_collection" valuePropName="checked">
//             <Checkbox>Special Collection</Checkbox>
//           </Form.Item>

//           {colorFields.map((color, index) => (
//             <Space key={index} direction="vertical" style={{ width: "100%" }}>
//               <Form.Item label="Color" name={["colors", index, "color_id"]}>
//                 <Select
//                   placeholder="Select color"
//                   value={color.color_id} // Make sure the value is tied to the color_id of the color variant
//                   onChange={(value) =>
//                     handleColorChange(value, "color_id", index)
//                   }
//                   loading={colorsloading}
//                 >
//                   {havingcolors?.map((color) => (
//                     <Select.Option key={color.id} value={color.id}>
//                       {color.name}
//                     </Select.Option>
//                   ))}
//                 </Select>
//               </Form.Item>

//               <Form.Item
//                 label="Stock Quantity"
//                 name={["colors", index, "stock_quantity"]}
//               >
//                 <InputNumber
//                   value={color.stock_quantity} // Tied to the stock_quantity of the color variant
//                   onChange={(value) =>
//                     handleColorChange(value, "stock_quantity", index)
//                   }
//                 />
//               </Form.Item>
//               <Form.Item label="Price" name={["colors", index, "price"]}>
//                 <InputNumber
//                   value={color.price} // Tied to the price of the color variant
//                   onChange={(value) => handleColorChange(value, "price", index)}
//                 />
//               </Form.Item>

//               <Form.Item label="Images">
//                 <Upload
//                   listType="picture-card"
//                   fileList={color.images} // Tied to the images of the color variant
//                   onChange={(e) => handleImageChange(e, index)}
//                   beforeUpload={() => false}
//                 >
//                   <UploadOutlined />
//                 </Upload>
//               </Form.Item>

//               <Button type="danger" onClick={() => handleRemoveColor(index)}>
//                 Remove Color
//               </Button>
//             </Space>
//           ))}
//           <Button type="dashed" onClick={handleAddColor}>
//             Add Color
//           </Button>

//           <Form.Item name="description" label="Description">
//             <Input.TextArea rows={4} />
//           </Form.Item>
//         </Form>
//       </Modal>
//     </Main>
//   );
// };

// export default ProductPage;






import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Card,
  Col,
  Row,
  Modal,
  Form,
  Input,
  Select,
  Space,
  InputNumber,
  Upload,
  Checkbox,
  Breadcrumb,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  deleteProduct,
  fetchProducts,
  updateProduct,
} from "../../store/productsSlice";
import { Link } from "react-router-dom";
import Main from "./AdminLayout/AdminLayout";
import { fetchColors } from "../../store/colorsSlice";
import { fetchCategory } from "../../store/catogerySlice";
import Loader from "../Loader/Loader";
import uparrow from "./images/uparrow.svg";
import downarrow from "./images/uparrow.svg";
import productpageBanner from "./images/productpageBanner.png";



const { Meta } = Card;


const ProductPage = () => {
  
  
  
	const dispatch = useDispatch();

	const Navigate = useNavigate();
	const { id } = useParams();

	const [singleFabric, setSingleFabric] = useState([]);

	const { fabrics } = useSelector((state) => state.products);
	console.log("singlepro", singleFabric);
	console.log("fabrics", fabrics);

	const [imgno, setimgno] = useState(0);
	const [arrayimgs, setarrayimgs] = useState([]);
	const [productColorId, selectProductColorId] = useState(null);
	const [inputQuantity, setinputQuantity] = useState(0.5); 
	const [selectedColorid, setselectedColorid] = useState(null);
	const [msg, setMessage] = useState("");

	const { apiurl, access_token } = useSelector((state) => state.auth);

	useEffect(() => {
		fetchFabricdata({ id, apiurl });
	}, [id]);


	const fetchFabricdata = async ({ id, apiurl }) => {
		console.log("Fetching fabric by ID:", id);
		try {
			const response = await fetch(`${apiurl}/products/${id}`);
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.msg || "Network response was not ok");
			}
			const data = await response.json();
			console.log("Fetched fabric data:", data);
			// return data;
			setSingleFabric(data);
		} catch (error) {
			console.error("Error fetching fabric:", error.msg);
			throw error; // Re-throw the error for handling elsewhere
		}
	};

	useEffect(() => {
		if (
			singleFabric.product_colors &&
			singleFabric.product_colors.length > 0 &&
			!selectedColorid
		) {
			const firstColorId = singleFabric.product_colors[0].color.id;
			handleColorSelect(firstColorId);
			selectProductColorId(singleFabric.product_colors[0].id);
		}
	}, [singleFabric?.product_colors, selectedColorid, id, dispatch]);
	const [colorQuentity, setcolorQuentity] = useState(null);

	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 4;
	const handlePageChange = (page) => {
		setCurrentPage(page);
	};

	const displayedProducts = fabrics?.slice(
		(currentPage - 1) * pageSize,
		currentPage * pageSize
	);


  const handlemoveedit=()=>{
    Navigate(`/inventory/product/${singleFabric.id}/edit`)
    	}


      
  const handleDelete = () => {
    dispatch(deleteProduct({ id, access_token }))
      .unwrap()
      .then(() => {
        console.log("Product deleted successfully");
        dispatch(fetchProducts());
        Navigate("/inventory");
      })
      .catch((error) => console.error("Error deleting product:", error));
  };

	const handleUparrow = () => {
		console.log("imgno", imgno);
		if (imgno > 0) {
			setimgno(imgno - 1);
		} else if (imgno <= 0) {
			setimgno(imgno + arrayimgs.length - 1);
		}
	};

	const handleDownarrow = () => {
		console.log("imgno", imgno);
		if (imgno < arrayimgs.length - 1) {
			setimgno(imgno + 1);
		} else if (imgno >= arrayimgs.length - 1) {
			setimgno(0);
		}
	};
	const handleimges = (idx) => {
		setimgno(idx);
		// console.log("idx", idx);
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
		}
	};

	const increaseQuantity = () => {
		const newQuantity = inputQuantity + 0.5;
		if (newQuantity <= colorQuentity) {
			setinputQuantity(newQuantity);
			setMessage("");
		} else {
			setMessage("Quantity exceeds available stock.");
		}
	};

	const decreaseQuantity = () => {
		const newQuantity = inputQuantity - 0.5;
		if (newQuantity >= 0.5) {
			setinputQuantity(newQuantity);
			setMessage("");
		}
	};

	const handleQuentityInput = (e) => {
		const input = parseFloat(e.target.value);
		if (isNaN(input) || input < 0.5) {
			setinputQuantity(0.5);
			setMessage("Minimum quantity is 0.5.");
		} else if (input > colorQuentity) {
			setMessage("Quantity exceeds available stock.");
		} else {
			setinputQuantity(input);
			setMessage("");
		}
	};

	

	

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
							{/* <HeartOutlined /> */}
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
								₹{singleFabric?.product_colors[0]?.price} <span>per meter</span>
							</h2>
						)}

					<div className="rating_and_comments">
						<div className="rating">
							
						</div>
					</div>

					<h2 className="colors_heading">Colours Available</h2>

					<div
						className="colors_container"
						style={{ display: "flex", gap: "10px" }}>
						{singleFabric.product_colors &&
							singleFabric.product_colors.map((obj) => (
								<div
									key={obj.color.id}
									onClick={() => handleColorSelect(obj.color.id)}
									style={{
										width: "30px",
										height: "30px",
										backgroundColor: obj.color.name.toLowerCase(),
										cursor: "pointer",
										borderRadius: "50px",
										border:
											selectedColorid === obj.color.id
												? "2px solid #F24C88"
												: "",
									}}></div>
							))}

					</div>
					<div className="measers">
						<h4 >Leangth:{singleFabric.length}/ centimeters</h4>
						<h4 >breadth:{singleFabric.breadth}/ centimeters</h4>
						<h4 >height :{singleFabric.height}/ centimeters</h4>
					</div>

					<div className="cart_quentity">
						<Button primary onClick={handlemoveedit} >
						Update 
						</Button>
            <Button  danger onClick={handleDelete} >
						Delete 
						</Button>
					</div>
				</div>
			</div>


			<div className="product_description">
				<h2>Description</h2>
				<div
					className="desc-content"
					dangerouslySetInnerHTML={{ __html: singleFabric.description }}></div>
			</div>
		</div>
    </Main>

	);
  
};

export default ProductPage;
