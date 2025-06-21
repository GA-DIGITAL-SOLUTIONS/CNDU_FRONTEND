import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../../store/orderSlice";
import {
  Table,
  Modal,
  Button,
  Form,
  DatePicker,
  message,
  Input,
  Spin,
} from "antd";
import { Link } from "react-router-dom";
import Main from "./AdminLayout/AdminLayout";
import PrintInvoiceButton from "../utils/DownloadInvoice";
import axios from "axios";


const { RangePicker } = DatePicker;

const PreBookingOrders = () => {
  const dispatch = useDispatch();
  const { apiurl, access_token } = useSelector((state) => state.auth);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [SearchInput, SetSearchInput] = useState("");
  const [currentPage, SetCurrentPage] = useState(1);
  const [totalNormalOrders, SetTotalNormalOrders] = useState(1);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dateRange, setDateRange] = useState([]); // For storing the selected date range
  const [orders, setOrders] = useState([]);
  const [todayOrdersCount] = useState(0);
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // dispatch(fetchOrders({ apiurl, access_token }));
    fetchOrders();
  }, [dispatch, apiurl, access_token, SearchInput, currentPage]);

  // const { orders, fetchOrdersloading } = useSelector((state) => state.orders);

  function fetchOrders() {
    setLoading(true);
    let url = `${apiurl}/orders/?page=${currentPage}&&p_type=1`;
    if (SearchInput) {
      url += `&search=${encodeURIComponent(SearchInput)}`;
    }

    fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        return response.json();
      })
      .then((data) => {
        const ordersWithUsername = data.results.map((order) => ({
          ...order,
          username: order.user?.username || "N/A",
        }));

        setOrders(ordersWithUsername);
        setFilteredOrders(ordersWithUsername);
        SetTotalNormalOrders(data.count);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error("❌ Error:", error.message);
      });
  }

  // useEffect(() => {
  //   if (orders && orders.length > 0) {
  //     const falsePTypeOrders = orders.filter(
  //       (order) => order?.items[0]?.p_type === false
  //     );

  //     // console.log("Today's orders count:", countTodayOrders(orders));

  //     setFilteredOrders(
  //       falsePTypeOrders.map((order) => ({
  //         ...order,
  //         username: order.user?.username || "N/A",
  //       }))
  //     );
  //   }
  // }, [orders]);

	const [invoicesLoder,setInvoicesLoader]=useState(false)

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const { fromDate, endDate } = values;
        const formattedFromDate = fromDate.format("YYYY-MM-DD");
        const formattedEndDate = endDate.format("YYYY-MM-DD");
setInvoicesLoader(true)
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
						setInvoicesLoader(false)
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
		console.log(dates)

    // if (dates && dates.length === 2) {
    //   const [startDate, endDate] = dates;
    //   const startTimestamp = startDate.startOf("day").valueOf();
    //   const endTimestamp = endDate.endOf("day").valueOf();

    //   const filtered = filteredOrders.filter((order) => {
    //     const orderDate = new Date(order.created_at).getTime();
    //     return orderDate >= startTimestamp && orderDate <= endTimestamp;
    //   });

    //   setFilteredOrders(
    //     filtered.map((order) => ({
    //       ...order,
    //       username: order.user?.username || "N/A",
    //     }))
    //   );
    // } else {
    //   // If no date range is selected, show all orders
    // }
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
          .replace(/\//g, "-");
        const formattedTime = date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
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

  const handleSearch2 = (e) => {
    const input = e.target.value;
    // console.log("Search input:", input);
    const filteredproducts = orders.filter(
      (order) => order.id.toString().includes(input) // Check if order ID contains the input
    );
    // setFilteredOrders(filteredproducts); // Update the state with filtered results
    setFilteredOrders(
      filteredproducts.map((order) => ({
        ...order,
        username: order.user?.username || "N/A",
      }))
    );
  };

  console.log("filteredOrders", filteredOrders);

  // console.log("totalNormalOrders",totalNormalOrders)

  return (
    <Main>
      <div className="OrdersforAdmin">
        <div style={{ display: "flex" }}>
          <Input
            placeholder="Search by Order ID or Username"
            value={SearchInput}
            onChange={(e) => {
              SetSearchInput(e.target.value);
              SetCurrentPage(1); // reset to page 1 on new search
            }}
            allowClear
            style={{ width: "200px", borderRadius: "50px", height: "35px" }}
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
          style={{ margin: "0px 50px", textAlign: "center" }} // Ensures centering
          dataSource={filteredOrders}
          columns={columns}
          rowKey="id"
          pagination={{
            total: totalNormalOrders,
            pageSize: 10,
            current: currentPage,
            onChange: (page) => SetCurrentPage(page),
          }}
          loading={{
            spinning: loading,
            indicator: (
              <div
                style={{
                  color: "#007bff",
                  fontSize: "16px",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                Loading...
              </div>
            ),
          }}
          tableLayout="fixed" // Helps align columns properly
        />

        <Modal
          title="Generate Invoices"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={() => setIsModalVisible(false)}
          okText="Generate"
          cancelText="Cancel"
					loading={invoicesLoder}
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

export default PreBookingOrders;
