import React, { useState } from "react";
import { Form, InputNumber, Select, Button, Space, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

const CheckForm = () => {
  const [colorFields, setColorFields] = useState([{ color_id: "", stock_quantity: 0, price: 0 }]);

  const handleAddColor = () => {
    setColorFields([...colorFields, { color_id: "", stock_quantity: 0, price: 0 }]);
  };

  const handleRemoveColor = (index) => {
    const newFields = colorFields.filter((_, i) => i !== index);
    setColorFields(newFields);
  };

  const handleColorChange = (index, field, value) => {
    const newFields = [...colorFields];
    newFields[index][field] = value;
    setColorFields(newFields);
  };

  return (
    <div>
      <Form layout="vertical">
        {colorFields.map((colorData, index) => (
          <div key={index} style={{ marginBottom: 20 }}>
            <h4>Color {index + 1}</h4>

            <Space direction="vertical" style={{ width: "100%" }}>
              <Space style={{ display: "flex", marginBottom: 8 }}>
                <Form.Item
                  label="Color"
                  name={["colors", index, "color_id"]}
                  rules={[{ required: true, message: "Please select a color" }]}
                  style={{ flex: 1 }}
                >
                  <Select
                    placeholder="Select color"
                    value={colorData.color_id}
                    onChange={(value) => handleColorChange(index, "color_id", value)}
                  >
                    <Option value="1">Red</Option>
                    <Option value="2">Blue</Option>
                    <Option value="3">Green</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Stock Quantity"
                  name={["colors", index, "stock_quantity"]}
                  rules={[{ required: true, message: "Enter stock quantity" }]}
                  style={{ flex: 1 }}
                >
                  <InputNumber
                    placeholder="Stock Quantity"
                    min={0}
                    value={colorData.stock_quantity}
                    onChange={(value) => handleColorChange(index, "stock_quantity", value)}
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
                    value={colorData.price}
                    onChange={(value) => handleColorChange(index, "price", value)}
                  />
                </Form.Item>

                <Form.Item label="Upload Images" style={{ flex: 1 }}>
                  <Upload multiple>
                    <Button icon={<UploadOutlined />}>Upload Images</Button>
                  </Upload>
                </Form.Item>
              </Space>

              <Button danger onClick={() => handleRemoveColor(index)}>
                Remove Color
              </Button>
            </Space>
          </div>
        ))}

        <Button type="dashed" onClick={handleAddColor} style={{ marginTop: 16 }}>
          Add Color
        </Button>
      </Form>
    </div>
  );
};

export default CheckForm;
