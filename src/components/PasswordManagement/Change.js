import { useState } from "react";
import { Button, Input, message, Form } from "antd";
import { useNavigate } from "react-router-dom";
import Layout from "../User/Layout";
import Loader from "../Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "../../store/password/passwordSlice";

const ResetPasswordForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const access_token = useSelector((store) => store.auth.access_token);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

	const handleSubmit = async (values) => {
    setLoading(true);
    const { currentPassword, newPassword, confirmPassword } = values;

    if (newPassword !== confirmPassword) {
        message.error("New passwords do not match");
        setLoading(false);
        return;
    }

    try {
        const response = await dispatch(changePassword({ currentPassword, newPassword, confirmPassword,access_token }));
        
        if (response.error) {
            // Handle error from the API
            message.error(response.error.message || "Failed to change password");
        } else {
            message.success("Password changed successfully!");
            // Navigate or reset the form if needed
            navigate("/success"); // or wherever you want to navigate
        }
    } catch (error) {
        message.error("An unexpected error occurred. Please try again.");
    } finally {
        setLoading(false);
    }
};

 // if (loading) {
  //   return <Loader />;
  // }

 
  return (
    <div className="change-pass-form">
      <div>
        <Form
          form={form}
          className="form"
          layout="vertical"
          initialValues={{
            remember: true,
          }}
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="Current Password"
            name="currentPassword"
            rules={[
              {
                required: true,
                message: "Please input your current password!",
              },
            ]}
          >
            <Input.Password className="inp" />
          </Form.Item>

          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[
              {
                required: true,
                message: "Please input your new password!",
              },
            ]}
          >
            <Input.Password className="inp" />
          </Form.Item>

          <Form.Item
            label="Confirm New Password"
            name="confirmPassword"
            rules={[
              {
                required: true,
                message: "Please confirm your new password!",
              },
            ]}
          >
            <Input.Password className="inp" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-submit-btn"
              loading={loading}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
