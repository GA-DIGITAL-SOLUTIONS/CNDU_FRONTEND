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
  Table,
  Popconfirm,
} from "antd";
import moment from "moment";
import {
  createDiscount,
  fetchDiscounts,
  deleteDiscount,
} from "../../store/discountSlice";
import { useDispatch, useSelector } from "react-redux";
import Main from "./AdminLayout/AdminLayout";
import { fetchProducts } from "../../store/productsSlice";
import Loader from "../Loader/Loader";
import MainLayout from "../users/Layout/MainLayout";

const { Option } = Select;

const Discounts = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { apiurl, access_token } = useSelector((state) => state.auth);
  const { products, productsloading } = useSelector((state) => state.products);
  const { discounts, discountsloading, creatediscountsloading } = useSelector(
    (state) => state.discounts
  );

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
    return (
      <Main>
        <Loader />
      </Main>
    );
  }

  const handleSubmit = (values) => {
    const formData = values;
    dispatch(createDiscount({ apiurl, access_token, formData }))
      .unwrap()
      .then(() => {
        form.resetFields();
        dispatch(fetchDiscounts({ apiurl, access_token }));
      });
  };

  // Function to handle discount deletion
  const handleDelete = (discountId) => {
    // console.log("discountId", discountId);
    const d_id = discountId;
    dispatch(deleteDiscount({ apiurl, access_token, d_id }))
      .unwrap()
      .then(() => {
        dispatch(fetchDiscounts({ apiurl, access_token }));
      });
  };

  // Format the data for the table
  const formattedDiscounts = discounts.map((discount) => ({
    key: discount?.id,
    id: discount?.id,
    name: discount?.name,
    percentage: discount?.percentage,
    start_date: discount?.start_date,
    end_date: discount?.end_date,
    products: discount?.items?.map((item) => ({
      productId: item?.id,
      productName: item?.name,
    })),
  }));

  // Table columns
  const columns = [
    {
      title: "Discount ID",
      dataIndex: "id",
      key: "id",
    },

    {
      title: "Percentage",
      dataIndex: "percentage",
      key: "percentage",
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
      key: "start_date",
      render: (text) => moment(text).format("YYYY-MM-DD"),
    },
    {
      title: "End Date",
      dataIndex: "end_date",
      key: "end_date",
      render: (text) => moment(text).format("YYYY-MM-DD"),
    },
    {
      title: "Products",
      key: "products",
      render: (_, record) => (
        <div>
          {record?.products?.map((product) => (
            <p key={product.productId}>
              {/* No: {product.productId} | */}
              {product.productName}
            </p>
          ))}
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Popconfirm
          title="Are you sure you want to delete this discount?"
          onConfirm={() => handleDelete(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button danger>Delete</Button>
        </Popconfirm>
      ),
    },
  ];

  // console.log("discounts", discounts);

  return (
    <Main>
      {true ? (
        <Table
          columns={columns}
          dataSource={formattedDiscounts}
          rowKey="id"
          loading={discountsloading}
          pagination={false}
        />
      ) : (
        ""
      )}
      <Button type="primary" onClick={showModal} style={{ margin: "20px" }}>
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
              // allowSearch
              showSearch
              optionFilterProp="children"
            >
              {products.map((product) => (
                <Option key={product.id} value={product.id}>
                  {product.name}
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
