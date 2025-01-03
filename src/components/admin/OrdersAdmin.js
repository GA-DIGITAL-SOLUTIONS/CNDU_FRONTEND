import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../../store/orderSlice";
import { Table, Modal, Button, Form, DatePicker, message } from "antd";
import { Link } from "react-router-dom";
import Main from "./AdminLayout/AdminLayout";
import PrintInvoiceButton from "../utils/DownloadInvoice";
import axios from "axios";

const OrdersAdmin = () => {
  const dispatch = useDispatch();
  const { apiurl, access_token } = useSelector((state) => state.auth);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchOrders({ apiurl, access_token }));
  }, [dispatch, apiurl, access_token]);

  const { orders } = useSelector((state) => state.orders);

  useEffect(() => {
    if (orders && orders.length > 0) {
      const falsePTypeOrders = orders.filter(
        (order) => order?.items[0]?.p_type === false
      );

      setFilteredOrders(
        falsePTypeOrders.map((order) => ({
          ...order,
          username: order.user?.username || "N/A",
        }))
      );
    }
  }, [orders]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const { fromDate, endDate } = values;
        const formattedFromDate = fromDate.format("YYYY-MM-DD");
        const formattedEndDate = endDate.format("YYYY-MM-DD");

        axios
          .post(
            `${apiurl}/download_invoices/`,
            { fromDate: formattedFromDate, endDate: formattedEndDate },
            {
              headers: {
                Authorization: `Bearer ${access_token}`,
                "Content-Type": "application/json",
              },
              responseType: "blob", // Handle binary data
            }
          )
          .then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "invoices.pdf");
            document.body.appendChild(link);
            link.click();
            link.remove();
            message.success("Invoices downloaded successfully!");
          })
          .catch((error) => {
            console.error("Error downloading invoices:", error);
            message.error("Failed to download invoices. Please try again.");
          })
          .finally(() => {
            setIsModalVisible(false);
          });
      })
      .catch((info) => {
        console.error("Validation Failed:", info);
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
      render: (id) => <Link to={`/adminorders/${id}`}>#{id}</Link>,
    },
    {
      title: "Customer Name",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Ordered At",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Amount Paid",
      dataIndex: "total_discount_price",
      key: "total_discount_price",
      render: (total_discount_price, record) => {
        const shippingCharges = Number(record.shipping_charges) || 0;
        const amountPaid = (Number(total_discount_price) || 0) + shippingCharges;
        return <span>{`₹${amountPaid.toFixed(2)}`}</span>;
      },
    },
    {
      title: "Print Invoice",
      dataIndex: "id",
      key: "id2",
      render: (id) => <PrintInvoiceButton orderId={id} />,
    },
  ];

  return (
    <Main>
      <div className="OrdersforAdmin">
        <Button
          type="primary"
          onClick={() => setIsModalVisible(true)}
          style={{ marginBottom: "20px", marginLeft: "50px" }}
        >
          All Invoices
        </Button>
        <Table
          style={{ margin: "0px 50px" }}
          dataSource={filteredOrders}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />

        <Modal
          title="Generate Invoices"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="Generate"
          cancelText="Cancel"
        >
          <Form form={form} layout="vertical">
            <Form.Item
              label="From Date"
              name="fromDate"
              rules={[{ required: true, message: "Please select the from date!" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              label="End Date"
              name="endDate"
              rules={[
                { required: true, message: "Please select the end date!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("fromDate") <= value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("End date must be after the from date!")
                    );
                  },
                }),
              ]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Main>
  );
};

export default OrdersAdmin;
