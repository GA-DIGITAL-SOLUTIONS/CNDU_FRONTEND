import React, { useState, useEffect } from "react";
import { Form, Input, Button, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import Heading from "../Heading/Heading";
import { fetchUserDetails, updateUserDetails } from "../../../store/userInfoSlice";

const AccountTab = () => {
  const { apiurl, access_token } = useSelector((state) => state.auth);
  const { user, userdatasloading } = useSelector((state) => state.user);
  const [form] = Form.useForm(); // Initialize the form
  const [isModalVisible, setIsModalVisible] = useState(false); // Track modal visibility
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userdatasloading) {
      form.setFieldsValue({
        username: user.username || "",
        phone_number: user.phone_number || "",
        email: user.email || "",
      });
    }
  }, [userdatasloading, user, form]);

  useEffect(() => {
    dispatch(fetchUserDetails({ apiurl, access_token })).unwrap();
  }, [apiurl, access_token, dispatch]);

  // Function to show the modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Function to handle cancel (close modal)
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Function to handle form submission when saving changes
  const handleSave = (values) => {
    console.log("values",values)
    // dispatch(updateUserDetails({ apiurl, access_token, data: values }))
    //   .then(() => {
    //     setIsModalVisible(false); // Close modal after saving
    //   })
    //   .catch((error) => {
    //     console.log("Error updating user details:", error);
    //   });
  };

  return (
    <div className="account-tab">
      <Heading>Account Information</Heading>
      <Form
        form={form} // Bind the form instance
        layout="vertical"
        className="account-form"
      >
        <Form.Item label="User Name" name="username">
          <Input readOnly />
        </Form.Item>
        <Form.Item label="Phone Number" name="phone_number">
          <Input readOnly />
        </Form.Item>
        <Form.Item label="Email" name="email">
          <Input readOnly />
        </Form.Item>

        {/* Button to trigger modal */}
        <Button type="primary" onClick={showModal}>
          Edit
        </Button>
      </Form>

      {/* Modal for editing user details */}
      <Modal
        title="Edit Account Information"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null} // Hide default footer
      >
        <Form
          form={form} // Use the same form instance to edit values
          layout="vertical"
          onFinish={handleSave} // Trigger save when form is submitted
        >
          <Form.Item label="User Name" name="username">
            <Input />
          </Form.Item>
          <Form.Item label="Phone Number" name="phone_number">
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input />
          </Form.Item>

          <div className="action-buttons">
            <Button htmlType="submit" type="primary">
              Save
            </Button>
            <Button onClick={handleCancel} style={{ marginLeft: 8 }}>
              Cancel
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default AccountTab;
