import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, addProduct } from "../../store/productsSlice";
import { Layout } from "antd";

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
  Space,
  InputNumber,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
const { Content } = Layout;

const Inventory = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const { apiurl, access_token } = useSelector((state) => state.auth);
  const Navigate = useNavigate();

  // State to control the modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [colorFields, setColorFields] = useState([
    { color_id: "", stock_quantity: 0, price: 0, images: [] },
  ]);

  // Form instance
  const [form] = Form.useForm(); // Ensure 'form' is defined here

  const initialValues = {
    name: "",
    category_id: null,
    sub_category_id: null,
    price: 0,
    stock_quantity: 0,
    colors: [],
    is_special_collection: false,
    description: "",
    product_type:"",
  };

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAddProduct = () => {
    form
      .validateFields()
      .then((values) => {
        const formData = new FormData();

        // Append main form data
        formData.append("name", values.name);
        formData.append("category_id", values.category_id);
        formData.append("sub_category_id", values.sub_category_id);
        formData.append("description", values.description);
        formData.append("is_special_collection", values.is_special_collection);
        console.log("id",values.category_id)
        if(values.category_id===3){
          formData.append("product_type", "fabric");
        }else{
          formData.append("product_type", "product");
        }


        // Append colors as a JSON string
        const colors = colorFields.map((color) => ({
          color_id: color.color_id,
          stock_quantity: color.stock_quantity,
          price: color.price,
        }));
        formData.append("colors", JSON.stringify(colors));

        // Append images for each color
        colorFields.forEach((color) => {
          color.images.forEach((image) => {
            formData.append(`images_${color.color_id}`, image);
          });
        });

        // Dispatch action to add product
        console.log("add formData",formData)
        dispatch(addProduct({ formData, access_token }))
          .unwrap()
          .then(() => {
            dispatch(fetchProducts());
            setIsModalVisible(false);
            setImageFile(null);
          })
          .catch((error) => {
            console.error("Error adding product:", error);
          });
      })
      .catch((info) => {
        console.log("Validation Failed:", info);
      });
  };

  const handleImageChange = (e, index) => {
    const newColorFields = [...colorFields];
    newColorFields[index].images = e.fileList.map(
      (file) => file.originFileObj || file
    );
    setColorFields(newColorFields);
  };

  const handleAddColor = () => {
    setColorFields([
      ...colorFields,
      { color_id: "", stock_quantity: 0, price: 0, images: [] },
    ]);
  };

  const handleRemoveColor = (index) => {
    const newColorFields = colorFields.filter((_, i) => i !== index);
    setColorFields(newColorFields);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // if (loading) return <p>Loading products...</p>;
  // if (error) return <p>Error: {error}</p>;



  return (
   <Content>
   <div>
     <Button type="primary" onClick={showModal}>
       Add Product
     </Button>
     <Link to="/adminorders">
       <Button type="primary" style={{ marginLeft: "20px" }}>
         Orders
       </Button>
     </Link>
     <Link to="/discounts">
       <Button type="primary" style={{ marginLeft: "20px" }}>
       discounts
       </Button>
     </Link>
     <div className="stock">In stock: {products.length}</div>
     <Row gutter={[16, 16]}>
       {products.map((product) => {
         // Find the first image from the product colors
         const primaryImage =
           product.product_colors?.find(
             (colorObj) => colorObj.images.length > 0
           )?.images[0]?.image || product.image; // Fallback to main product image

         return (
           <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
             <Card hoverable>
               <Link to={`/inventory/product/${product.id}`}>
                 {/* Display the primary image */}
                 <img
                   src={`${apiurl}${primaryImage}`}
                   alt={product.name}
                   style={{
                     width: "100%",
                     height: "200px",
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
                 description={
                   <>
                     <p>Category: {product.category?.name || "N/A"}</p>
                     {product.sub_category?.name && (
                       <p>Sub-category: {product.sub_category.name}</p>
                     )}
                     <p>Available Colors:</p>
                     <ul>
                       {product.product_colors.map((colorObj) => (
                         <li key={colorObj.color.id}>
                           <strong>{colorObj.color.name}</strong> - Price: ₹
                           {colorObj.price}, Stock: {colorObj.stock_quantity}
                         </li>
                       ))}
                     </ul>
                   </>
                 }
               />
             </Card>
           </Col>
         );
       })}
     </Row>
   </div>

   {/* Add product form  */}
   <Modal
     title="Add New Product"
     visible={isModalVisible}
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
         <Select placeholder="Select a category">
           <Select.Option value={3}>Fabrics</Select.Option>
           <Select.Option value={4}>Sarees</Select.Option>
         </Select>
       </Form.Item>


       {/* <Form.Item
         name="product_type"
         label="ProductType"
         rules={[{ required: true, message: "Please select the category!" }]}
       >
         <Select placeholder="Select a category">
           <Select.Option value={"fabric"}>Fabrics</Select.Option>
           <Select.Option value={"saree"}>Sarees</Select.Option>
         </Select>
       </Form.Item> */}
       <Form.Item
         name="sub_category_id"
         label="Sub-category ID"
         rules={[
           { required: true, message: "Please select the sub-category!" },
         ]}
       >
         <Select placeholder="Select a sub-category">
           <Select.Option value={3}>Cotton</Select.Option>
           <Select.Option value={4}>Fancy</Select.Option>
         </Select>
       </Form.Item>
       {colorFields.map((color, index) => (
         <div key={index}>
           <h4>Color {index + 1}</h4>
           <Space direction="vertical" style={{ width: "100%" }}>
             <Space style={{ display: "flex", marginBottom: 8 }}>
               <Form.Item
                 label="Color"
                 name={["colors", index, "color_id"]}
                 rules={[
                   { required: true, message: "Please select a color" },
                 ]}
                 style={{ flex: 1 }}
               >
                 <Select
                   placeholder="Select color"
                   value={color.color_id}
                   onChange={(value) => {
                     const newColorFields = [...colorFields];
                     newColorFields[index].color_id = value;
                     setColorFields(newColorFields);
                   }}
                 >
                   <Select.Option value="1">Orange</Select.Option>
                   <Select.Option value="2">Green</Select.Option>
                   <Select.Option value="3">Violet</Select.Option>
                   <Select.Option value="4">Red</Select.Option>
                   <Select.Option value="5">Blue</Select.Option>
                 </Select>
               </Form.Item>

               <Form.Item
                 label="Stock Quantity"
                 name={["colors", index, "stock_quantity"]}
                 rules={[
                   { required: true, message: "Enter stock quantity" },
                 ]}
                 style={{ flex: 1 }}
               >
                 <InputNumber
                   placeholder="Stock Quantity"
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
                 name={["colors", index, "price"]}
                 rules={[{ required: true, message: "Enter price" }]}
                 style={{ flex: 1 }}
               >
                 <InputNumber
                   placeholder="Price"
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

               <Form.Item label="Upload Images" style={{ flex: 1 }}>
                 <Upload
                   listType="picture-card"
                   fileList={color.images}
                   onChange={(e) => handleImageChange(e, index)}
                   beforeUpload={() => false} // This prevents the default upload behavior
                 >
                   <UploadOutlined />
                   Upload
                 </Upload>
               </Form.Item>

               <Button
                 type="danger"
                 onClick={() => handleRemoveColor(index)}
               >
                 Remove Color
               </Button>
             </Space>
           </Space>
         </div>
       ))}
       <Button
         type="dashed"
         onClick={handleAddColor}
         style={{ width: "100%" }}
       >
         Add Color
       </Button>

       <Form.Item name="is_special_collection" valuePropName="checked">
         <Checkbox>Special Collection</Checkbox>
       </Form.Item>

       <Form.Item name="description" label="Description">
         <Input.TextArea rows={4} />
       </Form.Item>
     </Form>
   </Modal>

   </Content>
  );
};

export default Inventory;
// 2nd verison code 


