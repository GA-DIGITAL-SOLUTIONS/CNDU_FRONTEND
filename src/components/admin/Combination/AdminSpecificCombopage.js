import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Table, Image, Button, Modal, Form, Input, Checkbox, Select, Upload, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { fetchCombinationById, updateCombination, deleteCombination } from "../../../store/productsSlice";
import { useDispatch, useSelector } from "react-redux";
import "./AdminSpecificComboPage.css";
import { Link } from "react-router-dom";
import Main from "../AdminLayout/AdminLayout";

const { Option } = Select;

const AdminSpecificCombopage = () => {
  const dispatch = useDispatch();
  const { apiurl, access_token } = useSelector((state) => state.auth);
  const { singlecombination, products } = useSelector((state) => state.products);
  const navigate = useNavigate();
  const { id } = useParams();

  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (id) {
      dispatch(fetchCombinationById({ apiurl, id }));
    }
  }, [dispatch, apiurl, id]);

  useEffect(() => {
    // Pre-fill form data when the combination is fetched
    if (singlecombination) {
      form.setFieldsValue({
        combination_name: singlecombination.combination_name,
        combination_is_active: singlecombination.combination_is_active,
        combination_is_special_collection: singlecombination.combination_is_special_collection,
        items: singlecombination.items?.map((item) => item.item.id),
      });
    }
  }, [singlecombination, form]);

  const result =
    singlecombination?.items?.map(({ item }, index) => {
      const firstColor = item.product_colors[0]?.color?.name || "No color";
      const itemname = item.product_colors[0]?.product || "No name";
      const firstImage = item.product_colors[0]?.images[0]?.image || "No image";
      const id = item.id;
      const type = item.type;
      return {
        key: index,
        firstColor,
        firstImage,
        itemname,
        price: "200-300",
        id,
        type,
      };
    }) || [];

  const columns = [
    {
      dataIndex: "firstImage",
      key: "firstImage",
      render: (image, record) => {
        return (
          <div style={{ width: "200px" }}>
            <Link to={`/inventory/product/${record.id}`}>
              <Image src={`${apiurl}${image}`} alt="Product" width={80} />
            </Link>
          </div>
        );
      },
    },
    {
      dataIndex: "itemname",
      key: "itemname",
      render: (text, record) => {
        return (
          <div style={{ width: "200px" }}>
            <Link to={`/inventory/product/${record.id}`}>
              <strong>{record.itemname}</strong>
            </Link>
            <br />
            <span style={{ color: "#888" }}>{record.firstColor}</span>
            <span style={{ color: "#888" }}>{record.id}</span>
          </div>
        );
      },
    },
    {
      dataIndex: "price",
      key: "price",
    },
  ];

  const handleUpdate = () => {
    setIsUpdateModalVisible(true);
  };

  const handleDelete = () => {
    dispatch(deleteCombination({ access_token, id }))
      .unwrap()
      .then(() => {
        message.success("Combination deleted successfully!");
        navigate("/admincombinations");
      })
      .catch(() => {
        message.error("Failed to delete combination");
      });
  };

  const handleUpdateSubmit = async (values) => {
    const formData = new FormData();
    formData.append("combination_name", values.combination_name);
    formData.append("combination_is_active", values.combination_is_active);
    formData.append(
      "combination_is_special_collection",
      values.combination_is_special_collection
    );
    formData.append("items", JSON.stringify(values.items));

    fileList.forEach((file) => {
      formData.append("images", file.originFileObj);
    });

    try {
      await dispatch(updateCombination({ formData, access_token, id }))
        .unwrap()
        .then(() => {
          message.success("Combination updated successfully!");
          setIsUpdateModalVisible(false);
          dispatch(fetchCombinationById({ apiurl, id }));
        });
    } catch (error) {
      message.error("Failed to update combination");
    }
  };

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  return (
    <Main>
      <div className="singlecombination_container">
        {singlecombination ? (
          <>
            <div className="singlecombination_image">
              <h1>{singlecombination.combination_name}</h1>
              <img
                style={{ width: "350px" }}
                src={`${apiurl}${singlecombination.images?.[0]?.image}`}
                alt={singlecombination.combination_name}
              />
            </div>
            <div className="Combination_items">
              <Table
                className="Combination_items_table"
                style={{ height: "100%", margin: "0 auto" }}
                dataSource={result}
                columns={columns}
                pagination={false}
                width={50}
              />
              {/* <Button type="primary" onClick={handleUpdate}>
                Update
              </Button>
              <Button danger onClick={handleDelete}>
                Delete
              </Button> */}
            </div>

            <Modal
              title="Update Combination"
              open={isUpdateModalVisible}
              onCancel={() => setIsUpdateModalVisible(false)}
              footer={null}
            >
              <Form
                form={form}
                onFinish={handleUpdateSubmit}
                layout="vertical"
              >
                <Form.Item
                  name="combination_name"
                  label="Combination Name"
                  rules={[
                    {
                      required: true,
                      message: "Please input the combination name!",
                    },
                  ]}
                >
                  <Input placeholder="Enter combination name" />
                </Form.Item>

                <Form.Item
                  name="combination_is_special_collection"
                  valuePropName="checked"
                >
                  <Checkbox>Special Collection</Checkbox>
                </Form.Item>

                <Form.Item
                  name="items"
                  label="Items"
                  rules={[
                    {
                      required: true,
                      message: "Please select at least one product!",
                    },
                  ]}
                >
                  <Select mode="multiple" placeholder="Select products" allowClear>
                    {products?.map((product) => (
                      <Option key={product.id} value={product.id}>
                        {product.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item name="images" label="Upload Images">
                  <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onChange={handleFileChange}
                    beforeUpload={() => false}
                  >
                    {fileList.length < 5 && (
                      <div>
                        <PlusOutlined />
                        <div>Upload</div>
                      </div>
                    )}
                  </Upload>
                </Form.Item>

                <Form.Item>
                  {/* <Button type="primary" htmlType="submit">
                    Update Combination
                  </Button> */}
                </Form.Item>
              </Form>
            </Modal>
          </>
        ) : (
          <p>Loading combination details...</p>
        )}
      </div>
    </Main>
  );
};

export default AdminSpecificCombopage;
