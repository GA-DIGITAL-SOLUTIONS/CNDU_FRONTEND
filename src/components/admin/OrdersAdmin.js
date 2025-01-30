import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../../store/orderSlice";
import { Table, Modal, Button, Form, DatePicker, message } from "antd";
import { Link } from "react-router-dom";
import Main from "./AdminLayout/AdminLayout";
import PrintInvoiceButton from "../utils/DownloadInvoice";
import axios from "axios";
import Search from "antd/es/input/Search";

const { RangePicker } = DatePicker;

const OrdersAdmin = () => {
  const dispatch = useDispatch();
  const { apiurl, access_token } = useSelector((state) => state.auth);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [SearchInput, SetSearchInput] = useState("");

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dateRange, setDateRange] = useState([]); // For storing the selected date range

  const [todayOrdersCount, setOrdersCount] = useState(0);
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

      // console.log("Today's orders count:", countTodayOrders(orders));

      setFilteredOrders(
        falsePTypeOrders.map((order) => ({
          ...order,
          username: order.user?.username || "N/A",
        }))
      );
    }
  }, [orders]);

  useEffect(() => {}, []);

  const countTodayOrders = (filteredOrders) => {
    const today = new Date(); // Get the current date and time

    // Extract today's date in 'YYYY-MM-DD' format
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(today.getDate()).padStart(2, "0");
    const todayDateString = `${year}-${month}-${day}`;

    // Filter orders where the local date part of `created_at` matches today's date
    const todayOrders = filteredOrders.filter((order) => {
      const orderDate = new Date(order.created_at); // Parse the `created_at` field
      const orderYear = orderDate.getFullYear();
      const orderMonth = String(orderDate.getMonth() + 1).padStart(2, "0");
      const orderDay = String(orderDate.getDate()).padStart(2, "0");
      const orderDateString = `${orderYear}-${orderMonth}-${orderDay}`;

      return orderDateString === todayDateString; // Compare dates
    });

    return todayOrders.length; // Return the count of today's orders
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const { fromDate, endDate } = values;
        const formattedFromDate = fromDate.format("YYYY-MM-DD");
        const formattedEndDate = endDate.format("YYYY-MM-DD");

        axios
          .post(
            `${apiurl}/download_invoices/`, // Correct template literal syntax
            { fromDate: formattedFromDate, endDate: formattedEndDate },
            {
              headers: {
                Authorization: `Bearer ${access_token}`, // Correct template literal syntax
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

  const handleDateFilter = (dates) => {
    setDateRange(dates);
    if (dates && dates.length === 2) {
      const [startDate, endDate] = dates;
      const startTimestamp = startDate.startOf("day").valueOf();
      const endTimestamp = endDate.endOf("day").valueOf();

      const filtered = orders.filter((order) => {
        const orderDate = new Date(order.created_at).getTime();
        return orderDate >= startTimestamp && orderDate <= endTimestamp;
      });

      setFilteredOrders(
        filtered.map((order) => ({
          ...order,
          username: order.user?.username || "N/A",
        }))
      );
    } else {
      // If no date range is selected, show all orders
      setFilteredOrders(
        orders.map((order) => ({
          ...order,
          username: order.user?.username || "N/A",
        }))
      );
    }
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
      render: (text) => {
        const date = new Date(text);
        const formattedDate = date
          .toLocaleDateString("en-GB")
          .replace(/\//g, "-"); // dd-mm-yyyy
        const formattedTime = date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true, // 12-hour format with AM/PM
        });

        return (
          <div>
            <div>{formattedDate}</div>
            <div style={{ fontSize: "0.85em", color: "#555" }}>
              {formattedTime}
            </div>
          </div>
        );
      },
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
        const amountPaid =
          (Number(total_discount_price) || 0) + shippingCharges;
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


  const handleSearch = (value) => {
    // setSearchOrderId(value);
    // console.log("value",value)
    console.log("order",orders.filter((order)=>{
      console.log("value",value)
      console.log("id",order.id)
       if(order.id==value){
        return order.id
      }
      
    }))

    if (value) {
      const filtered = orders.filter((order) => order.id.toString() == value);

      console.log("filtered",filtered)
      setFilteredOrders(filtered);
    } 
    // else {
    //   setFilteredOrders(
    //     orders.map((order) => ({
    //       ...order,
    //       username: order.user?.username || "N/A",
    //     }))
    //   );
    // }
  };
  

  return (
    <Main>
      <div className="OrdersforAdmin">
        <div style={{ display: "flex", }}>
        <Search
          placeholder="Search Order ID"
          onSearch={handleSearch}
          enterButton
          allowClear
          style={{ width: 250 }}
        />
          <RangePicker
            onChange={handleDateFilter}
            style={{ marginBottom: "20px", marginLeft: "50px" }}
          />
          <Button
            type="primary"
            onClick={() => setIsModalVisible(true)}
            style={{ marginBottom: "20px", marginLeft: "50px" }}
          >
            All Invoices
          </Button>
        </div>
      

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
          onCancel={() => setIsModalVisible(false)}
          okText="Generate"
          cancelText="Cancel"
        >
          <Form form={form} layout="vertical">
            <Form.Item
              label="From Date"
              name="fromDate"
              rules={[
                { required: true, message: "Please select the from date!" },
              ]}
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
