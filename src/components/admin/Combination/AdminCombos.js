import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Upload,
  message,
  Select,
  Modal,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
  fetchProducts,
  addCombination,
  fetchCombinations,
} from "../../../store/productsSlice";
import { useDispatch, useSelector } from "react-redux";
import "./AdminCombos.css";
import { Link } from "react-router-dom";
import Main from "../AdminLayout/AdminLayout";
import Loader from "../../Loader/Loader";

const { Option } = Select;

const AdminCombos = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  const { Combinations ,loadingcombinations } = useSelector((state) => state.products);
  const { apiurl, access_token } = useSelector((state) => state.auth);
  const [combinationfetched, setcombinationsfetched] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCombinations())
      .unwrap()
      .then(() => {
        setcombinationsfetched(true);
      });
  }, [dispatch]);

  const handleChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleSubmit = async (values) => {
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
      await dispatch(addCombination({ formData, access_token }))
        .unwrap()
        .then(() => {
          message.success("Outfit combination created successfully");
          form.resetFields();
          dispatch(fetchCombinations());
          setFileList([]);
          setIsModalVisible(false);
        });
    } catch (error) {
      message.error("Failed to create outfit combination");
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  
  if (loadingcombinations) {
    return (
      <Main>
        <Loader />
      </Main>
    );
  }

  return (
    <Main>
      <div className="admin-combo-container">
        <div className="add-btn-cont">
          <Button type="primary" onClick={showModal}>
            Add Combination
          </Button>
        </div>
        <div className="admin-combo-cards-container">
          {Combinations?.map((comb) => {
            const firstImage = comb.images?.[0]?.image;
            return (
              <div key={comb.id} className="admin-combo-card">
                <Link to={`/admincombinations/${comb.id}`}>
                  {firstImage ? (
                    <div className="admin-combo-card-placeholder">
                      <img
                        className="admin-combo-card-image"
                        src={`${apiurl}${firstImage}`}
                        alt={comb.combination_name}
                      />
                    </div>
                  ) : (
                    <div className="admin-combo-card-placeholder">
                      <p>No image available</p>
                    </div>
                  )}
                  <div className="admin-combo-card-details">
                    <h2 className="admin-combo-card-title">
                      {comb.combination_name.length > 20
                        ? comb.combination_name.slice(0, 20) + "..."
                        : comb.combination_name}
                    </h2>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        <Modal
          title="Create Outfit Combination"
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            initialValues={{
              combination_is_active: false, 
              combination_is_special_collection: false,
            }}
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
              name="combination_is_active"
              valuePropName="checked" // Ensure valuePropName is correctly bound
            >
              <Checkbox>Is Active</Checkbox>
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
                onChange={handleChange}
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
              <Button type="primary" htmlType="submit">
                Create Outfit Combination
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Main>
  );
};

export default AdminCombos;
