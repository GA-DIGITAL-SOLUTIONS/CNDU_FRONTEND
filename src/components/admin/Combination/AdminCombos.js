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

const { Option } = Select;

const AdminCombos = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  const { Combinations } = useSelector((state) => state.products);
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

  useEffect(() => {
    if (combinationfetched) {
      console.log("Combinations", Combinations);
      Combinations.map((comb) => {
        console.log(comb.images[0].image);
      });
    }
  }, [combinationfetched]);

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

  return (
    <div className="combinationContainer">
      <div className="combination-cards-container">
        {Combinations?.map((comb) => {
          const firstImage = comb.images?.[0]?.image;
          return (
            <div key={comb.id} className="combination-card">
              {firstImage ? (
                <Link to={`/admincombinations/${comb.id}`}>
                <img
                  className="combination-card-image"
                  src={`${apiurl}${firstImage}`}
                  alt={comb.combination_name}
                />
                </Link>
              ) : (
                <div className="combination-card-placeholder">
                  <p>No image available</p>
                </div>
              )}
              <div className="combination-card-details">
                <h2 className="combination-card-title">
                  <Link to={`/admincombinations/${comb.id}`}>
                  {comb.combination_name}
                  </Link>
                </h2>
              </div>
            </div>
          );
        })}
      </div>
      <Button type="primary" onClick={showModal}>
        Add Combination
      </Button>

      <Modal
        title="Create Outfit Combination"
        visible={isModalVisible}
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
              { required: true, message: "Please input the combination name!" },
            ]}
          >
            <Input placeholder="Enter combination name" />
          </Form.Item>

          <Form.Item
            name="combination_is_active"
            valuePropName="checked"
            label="Is Active"
          >
            <Checkbox>Active</Checkbox>
          </Form.Item>

          <Form.Item
            name="combination_is_special_collection"
            valuePropName="checked"
            label="Is Special Collection"
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
              beforeUpload={() => false} // Prevents immediate upload
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
  );
};

export default AdminCombos;





