import React from "react";
import { Form, Input, Select, Button, Upload, Switch, InputNumber,Checkbox } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { addOutfit } from "../../store/OutfitSlice";

const { Option } = Select;

const AddOutfit = () => {
  const { products } = useSelector((state) => state.products);
  const dispatch=useDispatch()
  const {apiurl}=useSelector((state)=>state.auth)
  console.log("products in products", products);
  const [form] = Form.useForm();


  const onFinish = (values) => {
    const formData = new FormData();
    formData.append("combination_name", values.combination_name);
    formData.append("outfit_1", values.outfit_1);
    formData.append("outfit_2", values.outfit_2);
    if (values.image) {
      formData.append("image", values.image.file);
    }

formData.append("combination_is_active", values.combination_is_active);
formData.append("combination_is_special_collection", values.combination_is_special_collection );
formData.append("price", parseFloat(values.price));

    formData.append("outfit_3", values.outfit_3 || "");

    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value} : ${typeof value}`);
    }
    console.log("formData",formData)
    dispatch(addOutfit({apiurl,formData}))
  };

  

  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="vertical"
      initialValues={{
        combination_is_active: false,
        combination_is_special_collection: false,
      }}
    >
      <Form.Item
        label="Combination Name"
        name="combination_name"
        rules={[{ required: true, message: "Please enter a combination name" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Outfit 1"
        name="outfit_1"
        rules={[{ required: true, message: "Please select an outfit" }]}
      >
        <Select
          placeholder="Select outfit 1"
          options={products.map((product) => ({
            label: product.name,
            value: product.id,
          }))}
          onChange={(value) => console.log("Selected Outfit ID:", value)}
        />
      </Form.Item>

      <Form.Item
        label="Outfit 2"
        name="outfit_2"
        rules={[{ required: true, message: "Please select an outfit" }]}
      >
         <Select
          placeholder="Select outfit 1"
          options={products.map((product) => ({
            label: product.name,
            value: product.id,
          }))}
          onChange={(value) => console.log("Selected Outfit ID:", value)}
        />
      </Form.Item>

      <Form.Item label="Image" name="image" valuePropName="file">
        <Upload beforeUpload={() => false} maxCount={1}>
          <Button icon={<UploadOutlined />}>Upload Image</Button>
        </Upload>
      </Form.Item>
      

      <Form.Item
        label="Combination is Active"
        name="combination_is_active"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>

      <Form.Item
        label="Combination is Special Collection"
        name="combination_is_special_collection"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>
      

      <Form.Item
        label="price"
        name="price"
        rules={[{ required: true, message: "Please enter a valid price" }]}
      >
        <InputNumber
          min={0}
          step={0.01}
          precision={2}
          style={{ width: "100%" }}
        />
      </Form.Item>

      <Form.Item label="Outfit 3 (Optional)" name="outfit_3">
      <Select
          placeholder="Select outfit 1"
          options={products.map((product) => ({
            label: product.name,
            value: product.id,
          }))}
          onChange={(value) => console.log("Selected Outfit ID:", value)}
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddOutfit;
