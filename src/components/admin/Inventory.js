// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchProducts, addProduct } from "../../store/productsSlice";
// import { Link } from "react-router-dom";
// import { Button, Modal, Form, Input, Select, Upload, Radio,Checkbox } from "antd";
// import { UploadOutlined } from "@ant-design/icons";

// const Inventory = () => {
//   const dispatch = useDispatch();
//   const { products, loading, error } = useSelector((state) => state.products);
//   const { apiurl, access_token } = useSelector((state) => state.auth);

//   // State to control the modal
//   const [isModalVisible, setIsModalVisible] = useState(false);

//   // Form instance
//   const [form] = Form.useForm();
//   const [imageFile, setImageFile] = useState(null);

//   // Initial values for the form
//   const initialValues = {
//     name: "",
//     category_id: NaN,
//     sub_category_id: NaN,
//     image: null,
//     price: 0,
//     stock_quantity: 0,
//     colors: [],
//     is_special_collection: false,
//     description: "",
//   };

//   // Fetch products on component mount
//   useEffect(() => {
//     dispatch(fetchProducts());
//   }, [dispatch]);

//   const handleAddProduct = () => {

//     form
//       .validateFields()
//       .then((values) => {
//         // Create a new FormData instance
//         const formData = new FormData();

//         // Append form data to FormData object
//         formData.append("name", values.name);
//         formData.append("category_id", values.category_id);
//         formData.append("sub_category_id", values.sub_category_id);
//         formData.append("price", values.price);
//         formData.append("stock_quantity", values.stock_quantity);
//         formData.append("description", values.description);
//         formData.append("is_special_collection", true);

//         formData.append("colors", JSON.stringify(values.colors));

//         // Append image file if available
//         if (imageFile) {
//           formData.append("image", imageFile);
//         }

//         formData.forEach((value, key) => {
//           console.log(`${key}: ${value}, Type: ${typeof value}`);
//         });

//         // Dispatch action with FormData payload
//         dispatch(addProduct({ formData, access_token }))
//           .unwrap()
//           .then(() => {
//             console.log("Product added successfully");
//             setIsModalVisible(false);
//             // form.resetFields();
//             setImageFile(null);
//           })
//           .catch((error) => {
//             console.error("Error adding product:", error);
//           });
//       })
//       .catch((info) => {
//         console.log("Validation Failed:", info);
//       });
//   };

//   const handleImageChange = (e) => {
//     if (e.fileList.length > 0) {
//       setImageFile(e.fileList[0].originFileObj);
//     } else {
//       setImageFile(null);
//     }
//   };

//   const showModal = () => {
//     setIsModalVisible(true);
//   };

//   const handleCancel = () => {
//     setIsModalVisible(false);
//   };

//   if (loading) return <p>Loading products...</p>;
//   if (error) return <p>Error: {error}</p>;

//   return (
//     <>
//       <ul>
//         {products.map((product) => (
//           <li key={product.id}>
//             <Link to={`/inventory/product/${product.id}`}>
//               <h2>{product.name}</h2>
//             </Link>
//             <p>Price: {product.price}</p>
//             <img src={`${apiurl}${product.image}`} alt={product.name} />
//           </li>
//         ))}
//       </ul>
//       <Button type="primary" onClick={showModal}>
//         Add Product
//       </Button>
//       <Modal
//         title="Add New Product"
//         open={isModalVisible}
//         onOk={handleAddProduct}
//         onCancel={handleCancel}
//       >
//         <Form form={form} layout="vertical" initialValues={initialValues}>
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
//             label="Category ID"
//             rules={[{ required: true, message: "Please select the category!" }]}
//           >
//             <Select
//               placeholder="Select a category"
//               onChange={(value) => {
//                 if (value === "Fabrics")
//                   form.setFieldsValue({ category_id: 3 });
//                 else if (value === "Sarees")
//                   form.setFieldsValue({ category_id: 4 });
//               }}
//             >
//               <Select.Option value="Fabrics">Fabrics</Select.Option>
//               <Select.Option value="Sarees">Sarees</Select.Option>
//             </Select>
//           </Form.Item>
//           <Form.Item
//             name="sub_category_id"
//             label="Sub-category ID"
//             rules={[
//               { required: true, message: "Please select the sub-category!" },
//             ]}
//           >
//             <Select
//               placeholder="Select a sub-category"
//               onChange={(value) => {
//                 if (value === "Cotton")
//                   form.setFieldsValue({ sub_category_id: 3 });
//                 else if (value === "Fancy")
//                   form.setFieldsValue({ sub_category_id: 4 });
//               }}
//             >
//               <Select.Option value="Cotton">Cotton</Select.Option>
//               <Select.Option value="Fancy">Fancy</Select.Option>
//             </Select>
//           </Form.Item>
//           <Form.Item
//             name="image"
//             label="Image"
//             rules={[{ required: true, message: "Please upload an image!" }]}
//           >
//             <Upload
//               listType="picture"
//               maxCount={1}
//               beforeUpload={() => false}
//               onChange={handleImageChange}
//             >
//               <Button icon={<UploadOutlined />}>Upload Image</Button>
//             </Upload>
//           </Form.Item>
//           <Form.Item
//             name="price"
//             label="Price"
//             rules={[{ required: true, message: "Please input the price!" }]}
//           >
//             <Input type="number" min={0} step="0.01" />
//           </Form.Item>
//           <Form.Item
//             name="stock_quantity"
//             label="Stock Quantity"
//             rules={[
//               { required: true, message: "Please input the stock quantity!" },
//             ]}
//           >
//             <Input type="number" min={0} />
//           </Form.Item>
//           <Form.Item
//             name="colors"
//             label="Colors"
//             rules={[
//               { required: true, message: "Please select at least one color!" },
//             ]}
//           >
//             <Select mode="multiple" placeholder="Select colors">
//               {[
//                 { id: 1, name: "Orange" },
//                 { id: 2, name: "Green" },
//                 { id: 3, name: "Violet" },
//                 { id: 4, name: "Red" },
//                 { id: 5, name: "Blue" },
//               ].map((color) => (
//                 <Select.Option key={color.id} value={color.id}>
//                   {color.name}
//                 </Select.Option>
//               ))}
//             </Select>
//           </Form.Item>
//           <Form.Item label="Is Special Collection" valuePropName="checked" name="is_special_collection">
//   <Checkbox>Yes</Checkbox>
// </Form.Item>

//           <Form.Item
//             name="description"
//             label="Description"
//             rules={[
//               {
//                 required: true,
//                 message: "Please input the product description!",
//               },
//             ]}
//           >
//             <Input.TextArea />
//           </Form.Item>
//         </Form>
//       </Modal>
//     </>
//   );
// };

// export default Inventory;

////////

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, addProduct } from "../../store/productsSlice";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  Upload,
  Checkbox,
  Row,
  Col,
  Card,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

const Inventory = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const { apiurl, access_token } = useSelector((state) => state.auth);
  const Navigate = useNavigate();
  // State to control the modal
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Form instance
  const [form] = Form.useForm(); // Ensure 'form' is defined here
  const [imageFile, setImageFile] = useState(null);

  // Initial values for the form
  const initialValues = {
    name: "",
    category_id: null, // Changed from NaN to null for better initial state
    sub_category_id: null,
    image: null,
    price: 0,
    stock_quantity: 0,
    colors: [],
    is_special_collection: false,
    description: "",
  };

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAddProduct = () => {
    form
      .validateFields()
      .then((values) => {
        // Create a new FormData instance
        const formData = new FormData();

        // Append form data to FormData object
        formData.append("name", values.name);
        formData.append("category_id", values.category_id);
        formData.append("sub_category_id", values.sub_category_id);
        formData.append("price", values.price);
        formData.append("stock_quantity", values.stock_quantity);
        formData.append("description", values.description);
        formData.append("is_special_collection", values.is_special_collection);
        formData.append("colors", JSON.stringify(values.colors));

        // Append image file if available
        if (imageFile) {
          formData.append("image", imageFile);
        }

        // Log form data and their types
        console.log("Form Data:");
        console.log(`name: ${values.name}, Type: ${typeof values.name}`);
        console.log(
          `category_id: ${
            values.category_id
          }, Type: ${typeof values.category_id}`
        );
        console.log(
          `sub_category_id: ${
            values.sub_category_id
          }, Type: ${typeof values.sub_category_id}`
        );
        console.log(`price: ${values.price}, Type: ${typeof values.price}`);
        console.log(
          `stock_quantity: ${
            values.stock_quantity
          }, Type: ${typeof values.stock_quantity}`
        );
        console.log(
          `description: ${
            values.description
          }, Type: ${typeof values.description}`
        );
        console.log(
          `is_special_collection: ${
            values.is_special_collection
          }, Type: ${typeof values.is_special_collection}`
        );
        console.log(
          `colors: ${JSON.stringify(
            values.colors
          )}, Type: ${typeof values.colors}`
        );

        // Log image file if it exists
        if (imageFile) {
          console.log(`image: ${imageFile.name}, Type: ${typeof imageFile}`);
        } else {
          console.log("image: null, Type: null");
        }

        // Dispatch action with FormData payload
        console.log("formData", formData);
        dispatch(addProduct({ formData, access_token }))
          .unwrap()
          .then(() => {
            console.log("Product added successfully");
            dispatch(fetchProducts());
            setIsModalVisible(false);
            setImageFile(null);
            form.resetFields();
          })
          .catch((error) => {
            console.error("Error adding product:", error);
          });
      })
      .catch((info) => {
        console.log("Validation Failed:", info);
      });
  };

  const handleImageChange = (e) => {
    if (e.fileList.length > 0) {
      setImageFile(e.fileList[0].originFileObj);
    } else {
      setImageFile(null);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const addoutfit = () => {
    Navigate("/addoutfit");
  };

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <div>
        <h1>Product List</h1>
        {products && products.length > 0 ? (
          <Row gutter={[16, 16]}>
            {products.map((product) => (
              <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                <Card>
                  {/* Wrap the image inside a Link to make it clickable */}
                  <Link to={`/inventory/product/${product.id}`}>
                    <img
                      src={`${apiurl}${product.image}`}
                      alt={product.name}
                      style={{
                        width: "100%",
                        height: "500px",
                        objectFit: "cover",
                      }}
                    />
                  </Link>
                  <Card.Meta
                    title={
                      <Link to={`/inventory/product/${product.id}`}>
                        {product.name}
                      </Link>
                    }
                    description={`Quantity: ${product.stock_quantity}`}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <div>No products available.</div>
        )}
      </div>

      <Button type="primary" onClick={showModal}>
        Add Product
      </Button>
      <Button type="primary" onClick={addoutfit}>
        Add outfit
      </Button>
      <Modal
        title="Add New Product"
        open={isModalVisible}
        onOk={handleAddProduct}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical" initialValues={initialValues}>
          <Form.Item
            name="name"
            label="Product Name"
            rules={[
              { required: true, message: "Please input the product name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="category_id"
            label="Category ID"
            rules={[{ required: true, message: "Please select the category!" }]}
          >
            <Select
              placeholder="Select a category"
              onChange={(value) => {
                // Logic to set category_id based on the selected category
                form.setFieldsValue({ category_id: value });
              }}
            >
              <Select.Option value={1}>Fabrics</Select.Option>
              <Select.Option value={2}>Sarees</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="sub_category_id"
            label="Sub-category ID"
            rules={[
              { required: true, message: "Please select the sub-category!" },
            ]}
          >
            <Select
              placeholder="Select a sub-category"
              onChange={(value) => {
                form.setFieldValue({ sub_category_id: value });
              }}
            >
              <Select.Option value={1}>Cotton</Select.Option>
              <Select.Option value={2}>Fancy</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="image"
            label="Image"
            rules={[{ required: true, message: "Please upload an image!" }]}
          >
            <Upload
              listType="picture"
              maxCount={1}
              beforeUpload={() => false}
              onChange={handleImageChange}
            >
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please input the price!" }]}
          >
            <Input type="number" min={0} step="0.01" />
          </Form.Item>
          <Form.Item
            name="stock_quantity"
            label="Stock Quantity"
            rules={[
              { required: true, message: "Please input the stock quantity!" },
            ]}
          >
            <Input type="number" min={0} />
          </Form.Item>
          <Form.Item
            name="colors"
            label="Colors"
            rules={[
              { required: true, message: "Please select at least one color!" },
            ]}
          >
            <Select mode="multiple" placeholder="Select colors">
              {[
                { id: 1, name: "Orange" },
                { id: 2, name: "Green" },
                { id: 3, name: "Violet" },
                { id: 4, name: "Red" },
                { id: 5, name: "Blue" },
              ].map((color) => (
                <Select.Option key={color.id} value={color.id}>
                  {color.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Is Special Collection"
            valuePropName="checked"
            name="is_special_collection"
          >
            <Checkbox>Yes</Checkbox>
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              {
                required: true,
                message: "Please input the product description!",
              },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Inventory;
