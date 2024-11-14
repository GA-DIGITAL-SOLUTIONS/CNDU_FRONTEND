import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Form, Input, Select, Upload, Checkbox } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { fetchProducts, updateProduct } from "../../store/productsSlice";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { access_token, apiurl } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  const numericId = Number(id);
  const product = products.find((product) => product.id === numericId);
  const [imageFile, setImageFile] = useState(product.image);
  const [form] = Form.useForm();

  useEffect(() => {
    if (!loading && product) {
      form.setFieldsValue({
        name: product.name,
        category_id: product.sub_category.category.id,
        sub_category_id: product.sub_category.id,
        price: product.price,
        stock_quantity: product.stock_quantity,
        colors: product.colors.map((color) => color.id), // Set colors as an array of IDs
        is_special_collection: product.is_special_collection,
        description: product.description,
      });
    }
  }, [product, loading, form]);

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
      dispatch(updateProduct({ id: numericId, formData, access_token }))
        .unwrap()
        .then(() => {
          navigate("/inventory");
        })
        .catch((error) => {
          console.error("Error updating product:", error);
        });
    });
  };

  const handleImageChange = (e) => {
    console.log("e",e)
    if (e.fileList.length > 0) {
      setImageFile(e.fileList[0].originFileObj);
    }
  };

  console.log(product);
  const existingImageURL = product && product.image ? `${apiurl}/${product.image}` : null;

  return (
    <Form form={form} layout="vertical">
      <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="category_id" label="Category ID" rules={[{ required: true }]}>
        <Select placeholder="Select a category">
          <Select.Option value={1}>Fabrics</Select.Option>
          <Select.Option value={2}>Sarees</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item name="sub_category_id" label="Sub-category ID" rules={[{ required: true }]}>
        <Select placeholder="Select a sub-category">
          <Select.Option value={1}>Cotton</Select.Option>
          <Select.Option value={2}>Fancy</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item name="image" label="Image">
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
          <Button icon={<UploadOutlined />}>Upload Image</Button>
        </Upload>
      </Form.Item>
      <Form.Item name="price" label="Price" rules={[{ required: true }]}>
        <Input type="number" min={0} step="0.01" />
      </Form.Item>
      <Form.Item name="stock_quantity" label="Stock Quantity" rules={[{ required: true }]}>
        <Input type="number" min={0} />
      </Form.Item>
      <Form.Item name="colors" label="Colors" rules={[{ required: true }]}>
        <Select mode="multiple" placeholder="Select colors">
          {[{ id: 1, name: "Orange" }, { id: 2, name: "Green" }, { id: 3, name: "Violet" }, { id: 4, name: "Red" }, { id: 5, name: "Blue" }].map((color) => (
            <Select.Option key={color.id} value={color.id}>
              {color.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="Is Special Collection" valuePropName="checked" name="is_special_collection">
        <Checkbox>Yes</Checkbox>
      </Form.Item>
      <Form.Item name="description" label="Description" rules={[{ required: true }]}>
        <Input.TextArea />
      </Form.Item>
      <Button type="primary" onClick={handleUpdateProduct}>
        Update Product
      </Button>
    </Form>
  );
};

export default UpdateProduct;
