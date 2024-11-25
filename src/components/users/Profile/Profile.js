import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, List, Card, Popconfirm, message } from "antd";
import { addUserAddress, fetchUserAddress, updateUserAddress, deleteUserAddress } from "../../../store/userAdressSlice";
import { useDispatch, useSelector } from "react-redux";

const Profile = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentAddressId, setCurrentAddressId] = useState(null);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { apiurl, access_token } = useSelector((state) => state.auth);
  const { addresses } = useSelector((state) => state.address);

  useEffect(() => {
    dispatch(fetchUserAddress({ apiurl, access_token }));
  }, []);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const addressData = values;

      if (isEdit) {
        await dispatch(updateUserAddress({ apiurl, access_token, addressData, id: currentAddressId })).unwrap();
      } else {
        await dispatch(addUserAddress({ apiurl, access_token, addressData })).unwrap();
      }

      dispatch(fetchUserAddress({ apiurl, access_token }));
      setIsModalVisible(false);
      setIsEdit(false);
      form.resetFields();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleEdit = (address) => {
    setIsModalVisible(true);
    setIsEdit(true);
    setCurrentAddressId(address.id);
    form.setFieldsValue({
      address: address.address,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
    });
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteUserAddress({ apiurl, access_token, id })).unwrap();
      dispatch(fetchUserAddress({ apiurl, access_token }));
      message.success("Address deleted successfully");
    } catch (error) {
      message.error("Failed to delete address");
    }
  };

  return (
    <div>
      <h1>Profile</h1>

      <Button
        type="primary"
        onClick={() => {
          setIsModalVisible(true);
          setIsEdit(false);
          form.resetFields();
        }}
        style={{ marginBottom: "20px" }}
      >
        Add Address
      </Button>

      {addresses?.data && addresses.data.length > 0 ? (
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={addresses.data}
          renderItem={(item) => (
            <List.Item>
              <Card
                title={item.address}
                extra={
                  <div>
                    <Button type="link" onClick={() => handleEdit(item)}>Edit</Button>
                    <Popconfirm
                      title="Are you sure you want to delete this address?"
                      onConfirm={() => handleDelete(item.id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button type="link" danger>
                        Delete
                      </Button>
                    </Popconfirm>
                  </div>
                }
              >
                <p>
                  <strong>City:</strong> {item.city}
                </p>
                <p>
                  <strong>State:</strong> {item.state}
                </p>
                <p>
                  <strong>Pincode:</strong> {item.pincode}
                </p>
              </Card>
            </List.Item>
          )}
        />
      ) : (
        <p>No addresses available.</p>
      )}

      <Modal
        title={isEdit ? "Edit Address" : "Add Address"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Please input the address!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="city"
            label="City"
            rules={[{ required: true, message: "Please input the city!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="state"
            label="State"
            rules={[{ required: true, message: "Please input the state!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="pincode"
            label="Pincode"
            rules={[{ required: true, message: "Please input the pincode!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Profile;
