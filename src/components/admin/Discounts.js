import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  InputNumber,
  Space,
  Row,
  Col,
  Card,
} from "antd";
import moment from "moment";
import { createDiscount, fetchDiscounts } from "../../store/discountSlice";
import { useDispatch, useSelector } from "react-redux";

const { Option } = Select;

const Discounts = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { apiurl, access_token } = useSelector((state) => state.auth);
  const { products } = useSelector((state) => state.products);
  const { discounts } = useSelector((state) => state.discounts);
  console.log(discounts)

  console.log("products", products);
  products.map((pro) => {
    console.log("pro.id", pro.id, pro.name);
  });

  // Open the modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Close the modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  useEffect(()=>{
    (dispatch(fetchDiscounts({apiurl,access_token})))
  },[])

  // Handle form submission
  const handleSubmit = (values) => {
    console.log("Form values: ", values);
    const formData = values;
    dispatch(createDiscount({ apiurl, access_token, formData }));
    // Here you can send the form data to your backend
    // e.g., make an API call to create the discount
    // Close the modal
    // setIsModalVisible(false);
  };

  return (
    <>
     <div>
      {discounts.map((discountGroup, groupIndex) => (
        <div key={groupIndex}>
          <h3>Discount Group {groupIndex + 1}</h3>
          <Row gutter={[16, 16]}>
            {discountGroup.map((discount) => (
              <Col span={8} key={discount.id}>
                <Card title={`Discount ID: ${discount.id}`} bordered={false}>
                  <p>Percentage: {discount.percentage}%</p>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ))}
    </div>


      <Button type="primary" onClick={showModal}>
        Create Discount
      </Button>

      <Modal
        title="Create Discount"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="name"
            label="Discount Name"
            rules={[
              { required: true, message: "Please enter a discount name!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Discount Description"
            rules={[{ required: true, message: "Please enter a description!" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="percentage"
            label="Discount Percentage"
            rules={[
              {
                required: true,
                message: "Please enter a discount percentage!",
              },
            ]}
          >
            <InputNumber min={1} max={100} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="start_date"
            label="Start Date"
            rules={[{ required: true, message: "Please select a start date!" }]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              style={{ width: "100%" }}
              defaultValue={moment()}
            />
          </Form.Item>

          <Form.Item
            name="end_date"
            label="End Date"
            rules={[{ required: true, message: "Please select an end date!" }]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              style={{ width: "100%" }}
              defaultValue={moment().add(1, "month")}
            />
          </Form.Item>

          <Form.Item
            name="object_ids"
            label="Select products"
            rules={[{ required: true, message: "Please select products!" }]}
          >
            <Select
              mode="multiple"
              placeholder="Select products"
              style={{ width: "100%" }}
            >
              {products.map((product) => (
                <Option key={product.id} value={product.id}>
                  {product.name} {/* Display product name */}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Space style={{ width: "100%" }} justify="end">
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Create Discount
            </Button>
          </Space>
        </Form>
      </Modal>
    </>
  );
};

export default Discounts;