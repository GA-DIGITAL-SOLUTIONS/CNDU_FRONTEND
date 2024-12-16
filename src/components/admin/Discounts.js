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
import Main from "./AdminLayout/AdminLayout";
import { fetchProducts } from "../../store/productsSlice";
import Loader from "../Loader/Loader";

const { Option } = Select;

const Discounts = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { apiurl, access_token } = useSelector((state) => state.auth);
  const { products, productsloading, productserror } = useSelector(
    (state) => state.products
  );
  const {
    discounts,
    discountsloading,
    discountserror,
    creatediscountsloading,
    creatediscountserror,
  } = useSelector((state) => state.discounts);

  console.log("products", products);
  console.log("discounts", discounts);

  products.map((pro) => {
    console.log("pro.id", pro.id, pro.name);
  });

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  useEffect(() => {
    dispatch(fetchDiscounts({ apiurl, access_token }));
  }, [apiurl, access_token]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (productsloading || discountsloading || creatediscountsloading) {
    return <Loader />;
  }
  if (!discountsloading) {
    console.log("discounts", discounts);
  }

  if (productserror) {
    return <div>Error loading products: {productserror.message}</div>;
  }
  if (discountserror) {
    return <div>Error loading discounts: {discountserror.message}</div>;
  }
  if (creatediscountserror) {
    return <div>Error creating discount: {creatediscountserror.message}</div>;
  }

  const handleSubmit = (values) => {
    console.log("Form values: ", values);
    const formData = values;
    dispatch(createDiscount({ apiurl, access_token, formData }))
      .unwrap()
      .then(() => {
        dispatch(fetchDiscounts({ apiurl, access_token }));
      });
  };

  console.log(
    discounts.map((discount) => {
      console.log("discount", discount);
    })
  );



	 
  return (
    <Main>
      <div>
        {discounts?.map((discountobj, idx) => (
          <div key={idx}>
						 <Card title={`Discount ID: ${discountobj.id}`} bordered={false}>
                  <p>Percentage: {discountobj.percentage}%</p>
									{discountobj.items.map((item)=>{
										return (
											<div>
													<p >No:{item.id}</p>
													<p key={item.id}>Name  : {item.name}</p>
											</div>
										)
									})}
                </Card>
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
                  {product.name} {}
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
    </Main>
  );
};

export default Discounts;
