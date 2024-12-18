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
  message,
} from "antd";
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
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
import TextArea from "antd/es/input/TextArea";

const UpdateProduct = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const { access_token, apiurl } = useSelector((state) => state.auth);
  const [singleproduct, setSingleProduct] = useState({});
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.products);
  const [colorFields, setColorFields] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProductId({ id, apiurl });
  }, [id, apiurl]);

  useEffect(() => {
    dispatch(fetchColors({ apiurl }));
    dispatch(fetchCategory({ apiurl }));
  }, [dispatch, apiurl]);

  useEffect(() => {
    if (singleproduct) {
      singleproduct.product_colors?.map((color) => {
        console.log("id", color.color.id);
      });
      const initialColors = singleproduct.product_colors?.map((color) => ({
        color_id: color.color.id,
        stock_quantity: color.stock_quantity,
        price: color.price,
        images: color.images.map((image) => ({
          uid: image.id,
          name: image.image.split("/").pop(),
          url: `${apiurl}${image.image}`,
          originFileObj: null,
        })),
      }));

      setColorFields(initialColors || []);

      form.setFieldsValue({
        name: singleproduct.name,
        category_id: singleproduct.category?.id || null,
        weight: singleproduct.weight || null,
        colors: initialColors,
        is_special_collection: singleproduct.is_special_collection || false,
        description: singleproduct.description || "",
      });
    }
  }, [singleproduct, apiurl, form]);

  const fetchProductId = async ({ id, apiurl }) => {
    try {
      const response = await fetch(`${apiurl}/products/${id}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      const data = await response.json();
      setSingleProduct(data);
    } catch (err) {
    } finally {
    }
  };

  const { havingcolors, colorsloading, colorserror } = useSelector(
    (state) => state.colors
  );
  const { categories, categoriesloading, categoriesserror } = useSelector(
    (state) => state.categories
  );

  if (!colorsloading) {
    console.log("colors", havingcolors);
  } else {
    console.log("colorserror", colorserror);
  }

  if (!categoriesloading) {
    console.log("categories", categories);
  } else if (categoriesserror) {
    console.log("colorserror", categoriesserror);
  }

  if (categoriesloading) {
    return <Loader />;
  }

  if (colorsloading) {
    return <Loader />;
  }

  const handleColorChange = (value, field, index) => {
    const updatedColors = [...colorFields];
    updatedColors[index][field] = value;
    setColorFields(updatedColors);
  };

  const handleAddColor = () => {
    setColorFields([
      ...colorFields,
      { color_id: null, stock_quantity: 0, price: 0, images: [] },
    ]);
  };

  const handleRemoveColor = (index) => {
    const updatedColors = [...colorFields];
    updatedColors.splice(index, 1);
    setColorFields(updatedColors);
  };

  const handleImageChange = (e, index) => {
    const updatedColors = [...colorFields];
    updatedColors[index].images = e.fileList;
    setColorFields(updatedColors);
  };

  const handleUpdateProduct = () => {
    form.validateFields().then(async (values) => {
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("category_id", values.category_id);
      formData.append("weight", values.weight);
      formData.append("is_special_collection", values.is_special_collection);
      formData.append("description", values.description);

      categories.forEach((obj) => {
        if (obj.id == values.category_id) {
          const productType = obj.name.toLowerCase() === 'Fabrics' ? 'fabric' : 'product';
          formData.append("product_type", productType);
        }
      });
      

      const colors = await Promise.all(
        colorFields.map(async (color, index) => {
          const imageFiles = await Promise.all(
            color.images.map(async (image) => {
              if (image.originFileObj) {
                return image.originFileObj;
              } else if (image.url) {
                const response = await fetch(image.url);
                const blob = await response.blob();
                return new File(
                  [blob],
                  image.name || `existing_image_${index}`,
                  { type: blob.type }
                );
              }
              return null;
            })
          );

          imageFiles.forEach((file, idx) => {
            if (file) formData.append(`images_${color.color_id}`, file);
          });

          return {
            color_id: color.color_id,
            stock_quantity: color.stock_quantity,
            price: color.price,
          };
        })
      );

      formData.append("colors", JSON.stringify(colors));

      dispatch(updateProduct({ id, formData, access_token }))
        .unwrap()
        .then(() => {
          form.resetFields();
          navigate("/inventory")
          message.success("Product updated successfully");
        })
        .catch((error) => console.error("Error updating product:", error));
    });
  };
  const handleCancel = () => setIsModalVisible(false);


  return (
    <Main>
    <div className="add-product-container">
        <Form
          form={form}
          layout="vertical"
          // initialValues={initialValues}
          className="add-product-form"
        >
          <div className="form-grid">
            <div className="form-left">
              <Form.Item
                name="name"
                label="Product Name"
                className="form-item"
                rules={[
                  { required: true, message: "Please input the product name!" },
                ]}
              >
                <Input placeholder="Enter product name" />
              </Form.Item>

              <Form.Item
                name="category_id"
                label="Category"
                className="form-item"
                rules={[
                  { required: true, message: "Please select the category!" },
                ]}
              >
                <Select
                  placeholder="Select a category"
                  loading={categoriesloading} // Show loading spinner if categories are being fetched
                >
                  {categories?.map((category) => (
                    <Select.Option key={category.id} value={category.id}>
                      {category.name}
                    </Select.Option>
                  ))}
                  {categoriesserror && (
                    <Select.Option disabled value="error">
                      Failed to load categories
                    </Select.Option>
                  )}
                </Select>
              </Form.Item>

              <Form.Item
                name="weight"
                label="Weight(in grams)"
                className="form-item"
                rules={[
                  {
                    required: true,
                    message: "Please enter the weight of the product!",
                  },
                ]}
              >
                <InputNumber min={50} step={0.5} />
              </Form.Item>

              <Form.Item
                name="description"
                label="Description"
                className="form-item"
              >
                <TextArea rows={4} placeholder="Enter product description" />
              </Form.Item>

              <Form.Item
                name="is_special_collection"
                valuePropName="checked"
                className="form-item"
              >
                <Checkbox>Special Collection</Checkbox>
              </Form.Item>

              <Button
                type="primary"
                onClick={handleUpdateProduct}
                className="submit-button"
              >
                update Product
              </Button>
            </div>

            <div className="form-right">
              {colorFields.map((color, index) => (
                <div key={ color.color_id||index} className="color-field">
                  <div className="add-prod-header">
                    <h4>Varient {index + 1}</h4>
                    <Button
                      danger
                      onClick={() => handleRemoveColor(index)}
                      className="remove-color-button"
                    >
                      <DeleteOutlined />
                    </Button>
                  </div>
                  <div className="color-field-space">
                    <Form.Item
                      label="Color"
                      className="form-item"
                      // name={["colors", index, "color_id"]}
                      placeholder="Select color"

                      rules={[
                        { required: true, message: "Please select a color!" },
                      ]}
                    >
                      <Select
                        placeholder="Select color"
                        value={color.color_id}
                        onChange={(value) => {
                          const newColorFields = [...colorFields];
                          newColorFields[index].color_id = value;
                          setColorFields(newColorFields);
                        }}
                        loading={colorsloading} // Show a spinner while loading colors
                      >
                        {havingcolors?.map((colorOption) => (
                          <Select.Option
                            key={colorOption.id}
                            value={colorOption.id}
                          >
                            {colorOption.name}
                          </Select.Option>
                        ))}
                        {colorserror && (
                          <Select.Option disabled value="error">
                            Failed to load colors
                          </Select.Option>
                        )}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      label="Stock Quantity"
                      className="form-item"
                      rules={[
                        { required: true, message: "Enter stock quantity" },
                      ]}
                    >
                      <InputNumber
                        min={0}
                        value={color.stock_quantity}
                        onChange={(value) => {
                          const newColorFields = [...colorFields];
                          newColorFields[index].stock_quantity = value;
                          setColorFields(newColorFields);
                        }}
                      />
                    </Form.Item>

                    <Form.Item
                      label="Price"
                      className="form-item"
                      rules={[{ required: true, message: "Enter price" }]}
                    >
                      <InputNumber
                        min={0}
                        step={0.01}
                        value={color.price}
                        onChange={(value) => {
                          const newColorFields = [...colorFields];
                          newColorFields[index].price = value;
                          setColorFields(newColorFields);
                        }}
                      />
                    </Form.Item>
                  </div>
                  <Form.Item label="Upload Images" className="form-item">
                    <Upload
                      listType="picture-card"
                      fileList={color.images}
                      onChange={(e) => handleImageChange(e, index)}
                      beforeUpload={() => false}
                    >
                      <UploadOutlined />
                      Upload
                    </Upload>
                  </Form.Item>
                </div>
              ))}

              <Button
                type="dashed"
                onClick={handleAddColor}
                className="add-color-button"
              >
                Add Varient
              </Button>
            </div>
          </div>
        </Form>
      </div>
      </Main>
  );
};

export default UpdateProduct;

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams, useNavigate } from "react-router-dom";
// import { Form, Input, Select, Upload, Button, Checkbox, Row, Col } from "antd";
// import { UploadOutlined } from "@ant-design/icons";

// import { fetchProductById, fetchProducts, updateProduct } from "../../store/productsSlice";

// const UpdateProduct = () => {

//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { access_token, apiurl } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();
//   const { products, loading, error } = useSelector((state) => state.products);

//   // const numericId = Number(id);
//   // const singleproduct = products.find((singleproduct) => singleproduct.id === numericId);

//   const{singleproduct,singleproductloading,singleproducterror}=useSelector((state)=>state.products)

//   useEffect(()=>{
//     dispatch(fetchProductById({id,url:apiurl}))
//   },[dispatch,id])

//   const [imageFile, setImageFile] = useState(singleproduct.image);
//   const [form] = Form.useForm();
//   const formItemStyle = {
//     marginBottom: '12px',
//   };

//   useEffect(() => {
//     if (!loading && singleproduct) {
//       form.setFieldsValue({
//         name: singleproduct.name,
//         category_id: singleproduct.sub_category.category.id,
//         sub_category_id: singleproduct.sub_category.id,
//         price: singleproduct.price,
//         stock_quantity: singleproduct.stock_quantity,
//         colors: singleproduct.colors.map((color) => color.id),
//         is_special_collection: singleproduct.is_special_collection,
//         description: singleproduct.description,
//       });
//     }
//   }, [singleproduct, loading, form]);

//   const handleUpdateProduct = () => {
//     form.validateFields().then((values) => {
//       const formData = new FormData();
//       Object.entries(values).forEach(([key, value]) => {
//         if (key === "colors") {
//           formData.append(key, JSON.stringify(value));
//         } else {
//           formData.append(key, value);
//         }
//       });
//       if (imageFile) {
//         formData.append("image", imageFile);
//         console.log("image",imageFile)
//       }
//       dispatch(updateProduct({ id, formData, access_token }))
//         .unwrap()
//         .then(() => {
//           navigate("/inventory");
//         })
//         .catch((error) => {
//           console.error("Error updating singleproduct:", error);
//         });
//     });
//   };

//   const handleImageChange = (e) => {
//     console.log("e",e)
//     if (e.fileList.length > 0) {
//       setImageFile(e.fileList[0].originFileObj);
//     }
//   };

//   console.log(singleproduct);
//   const existingImageURL = singleproduct && singleproduct.image ? `${apiurl}/${singleproduct.image}` : null;

//   return (
//     <Form
//     form={form}
//     layout="vertical"
//     style={{ maxWidth: '500px ',height:"100vh" ,margin: '0 auto',border:"1px solid pink",padding:"20px" }} // Center and limit form width
//   >
//     <Form.Item name="name" label="Product Name" rules={[{ required: true }]} style={formItemStyle}>
//       <Input size="small" />
//     </Form.Item>

//     <Form.Item name="category_id" label="Category ID" rules={[{ required: true }]} style={formItemStyle}>
//       <Select size="small" placeholder="Select a category">
//         <Select.Option value={1}>Fabrics</Select.Option>
//         <Select.Option value={2}>Sarees</Select.Option>
//       </Select>
//     </Form.Item>

//     <Form.Item name="sub_category_id" label="Sub-category ID" rules={[{ required: true }]} style={formItemStyle}>
//       <Select size="small" placeholder="Select a sub-category">
//         <Select.Option value={1}>Cotton</Select.Option>
//         <Select.Option value={2}>Fancy</Select.Option>
//       </Select>
//     </Form.Item>

//     <Form.Item name="image" label="Image" style={formItemStyle}>
//       <Upload
//         listType="picture"
//         maxCount={1}
//         beforeUpload={() => false}
//         onChange={handleImageChange}
//         defaultFileList={
//           existingImageURL
//             ? [
//                 {
//                   uid: "-1",
//                   name: "current_image.png",
//                   status: "done",
//                   url: existingImageURL,
//                 },
//               ]
//             : []
//         }
//       >
//         <Button size="small" icon={<UploadOutlined />}>Upload Image</Button>
//       </Upload>
//     </Form.Item>

//     <Form.Item name="price" label="Price" rules={[{ required: true }]} style={formItemStyle}>
//       <Input type="number" min={0} step="0.01" size="small" />
//     </Form.Item>

//     <Form.Item name="stock_quantity" label="Stock Quantity" rules={[{ required: true }]} style={formItemStyle}>
//       <Input type="number" min={0} size="small" />
//     </Form.Item>

//     <Form.Item name="colors" label="Colors" rules={[{ required: true }]} style={formItemStyle}>
//       <Select mode="multiple" placeholder="Select colors" size="small">
//         {[{ id: 1, name: "Orange" }, { id: 2, name: "Green" }, { id: 3, name: "Violet" }, { id: 4, name: "Red" }, { id: 5, name: "Blue" }].map((color) => (
//           <Select.Option key={color.id} value={color.id}>
//             {color.name}
//           </Select.Option>
//         ))}
//       </Select>
//     </Form.Item>

//     <Form.Item label="Is Special Collection" valuePropName="checked" name="is_special_collection" style={formItemStyle}>
//       <Checkbox>Yes</Checkbox>
//     </Form.Item>

//     <Form.Item name="description" label="Description" rules={[{ required: true }]} style={formItemStyle}>
//       <Input.TextArea rows={3} size="small" />
//     </Form.Item>

//     <Button type="primary" size="small" onClick={handleUpdateProduct} style={{ width: '100%' }}>
//       Update Product
//     </Button>
//   </Form>
//   );
// };

// export default UpdateProduct;
