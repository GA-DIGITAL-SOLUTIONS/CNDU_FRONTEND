import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Select, Upload, Button, Checkbox, Row, Col } from "antd";
import { UploadOutlined } from "@ant-design/icons";

import { fetchProductById, fetchProducts, updateProduct } from "../../store/productsSlice";

const UpdateProduct = () => {


  const { id } = useParams();
  const navigate = useNavigate();
  const { access_token, apiurl } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  // const numericId = Number(id);
  // const singleproduct = products.find((singleproduct) => singleproduct.id === numericId);

  const{singleproduct,singleproductloading,singleproducterror}=useSelector((state)=>state.products)

  useEffect(()=>{
    dispatch(fetchProductById({id,url:apiurl}))
  },[dispatch,id])
  

  const [imageFile, setImageFile] = useState(singleproduct.image);
  const [form] = Form.useForm();
  const formItemStyle = {
    marginBottom: '12px',
  };

  useEffect(() => {
    if (!loading && singleproduct) {
      form.setFieldsValue({
        name: singleproduct.name,
        category_id: singleproduct.sub_category.category.id,
        sub_category_id: singleproduct.sub_category.id,
        price: singleproduct.price,
        stock_quantity: singleproduct.stock_quantity,
        colors: singleproduct.colors.map((color) => color.id), 
        is_special_collection: singleproduct.is_special_collection,
        description: singleproduct.description,
      });
    }
  }, [singleproduct, loading, form]);


  const handleUpdateProduct = () => {
    form.validateFields().then((values) => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key === "colors") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });
      if (imageFile) {
        formData.append("image", imageFile);
        console.log("image",imageFile)
      }
      dispatch(updateProduct({ id, formData, access_token }))
        .unwrap()
        .then(() => {
          navigate("/inventory");
        })
        .catch((error) => {
          console.error("Error updating singleproduct:", error);
        });
    });
  };

  const handleImageChange = (e) => {
    console.log("e",e)
    if (e.fileList.length > 0) {
      setImageFile(e.fileList[0].originFileObj);
    }
  };

  console.log(singleproduct);
  const existingImageURL = singleproduct && singleproduct.image ? `${apiurl}/${singleproduct.image}` : null;

  return (
    <Form
    form={form}
    layout="vertical"
    style={{ maxWidth: '500px ',height:"100vh" ,margin: '0 auto',border:"1px solid pink",padding:"20px" }} // Center and limit form width
  >
    <Form.Item name="name" label="Product Name" rules={[{ required: true }]} style={formItemStyle}>
      <Input size="small" />
    </Form.Item>

    <Form.Item name="category_id" label="Category ID" rules={[{ required: true }]} style={formItemStyle}>
      <Select size="small" placeholder="Select a category">
        <Select.Option value={1}>Fabrics</Select.Option>
        <Select.Option value={2}>Sarees</Select.Option>
      </Select>
    </Form.Item>

    <Form.Item name="sub_category_id" label="Sub-category ID" rules={[{ required: true }]} style={formItemStyle}>
      <Select size="small" placeholder="Select a sub-category">
        <Select.Option value={1}>Cotton</Select.Option>
        <Select.Option value={2}>Fancy</Select.Option>
      </Select>
    </Form.Item>

    <Form.Item name="image" label="Image" style={formItemStyle}>
      <Upload
        listType="picture"
        maxCount={1}
        beforeUpload={() => false}
        onChange={handleImageChange}
        defaultFileList={
          existingImageURL
            ? [
                {
                  uid: "-1",
                  name: "current_image.png",
                  status: "done",
                  url: existingImageURL,
                },
              ]
            : []
        }
      >
        <Button size="small" icon={<UploadOutlined />}>Upload Image</Button>
      </Upload>
    </Form.Item>

    <Form.Item name="price" label="Price" rules={[{ required: true }]} style={formItemStyle}>
      <Input type="number" min={0} step="0.01" size="small" />
    </Form.Item>

    <Form.Item name="stock_quantity" label="Stock Quantity" rules={[{ required: true }]} style={formItemStyle}>
      <Input type="number" min={0} size="small" />
    </Form.Item>

    <Form.Item name="colors" label="Colors" rules={[{ required: true }]} style={formItemStyle}>
      <Select mode="multiple" placeholder="Select colors" size="small">
        {[{ id: 1, name: "Orange" }, { id: 2, name: "Green" }, { id: 3, name: "Violet" }, { id: 4, name: "Red" }, { id: 5, name: "Blue" }].map((color) => (
          <Select.Option key={color.id} value={color.id}>
            {color.name}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>

    <Form.Item label="Is Special Collection" valuePropName="checked" name="is_special_collection" style={formItemStyle}>
      <Checkbox>Yes</Checkbox>
    </Form.Item>

    <Form.Item name="description" label="Description" rules={[{ required: true }]} style={formItemStyle}>
      <Input.TextArea rows={3} size="small" />
    </Form.Item>

    <Button type="primary" size="small" onClick={handleUpdateProduct} style={{ width: '100%' }}>
      Update Product
    </Button>
  </Form>
  );
};

export default UpdateProduct;
