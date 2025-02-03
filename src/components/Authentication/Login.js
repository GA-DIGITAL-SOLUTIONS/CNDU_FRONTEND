import React, { useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import "./login.css";
import { useNavigate, Link } from "react-router-dom";
import img from "./../../images/loginbanner.png";
import logo from "./../../images/logo.png";
import { useDispatch, useSelector } from "react-redux"; // Import hooks from Redux
import { login } from "../../store/authSlice";
import { fetchCartItems, updateCartCount } from "../../store/cartSlice";


const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); 
  const { loading, error,apiurl ,access_token} = useSelector((state) => state.auth); 
	const {items,cartCount}=useSelector((state)=>state.cart);

// console.log("cartCount",cartCount)
  useEffect(() => {
    dispatch(fetchCartItems({ apiurl, access_token })).then(() => {
      
    });
  }, [dispatch]);

  const onFinish = async (values) => {
    const response = await dispatch(login(values));
    // console.log("response", response);
    if (login.fulfilled.match(response)) {
      if (response.payload.data.role === "admin") {
        navigate("/inventory");
        message.success("successfully  Login")
      } else if (response.payload.data.role === "user") {
        navigate("/");
      }
    } else {
      message.error("invalid credentials");
    }
  };

  const [form] = Form.useForm();

  const handleIconToHome = () => {
    navigate("/");
  };

  return (
    <>
      <div className="login-loginpage">
        <div className="left-sec">
          <div className="top-section">
            <img
              src={logo}
              alt="Logo"
              onClick={handleIconToHome}
              style={{ cursor: "pointer" }}
            />
          </div>
          <div>
            <Form
              form={form}
              title="Login"
              layout="vertical"
              className="form"
              onFinish={onFinish}
            >
              <h1>Welcome Back</h1>
              <p>Login into your account</p>
              <Form.Item
                name="phone_number"
                label="Phone Number"
                rules={[
                  {
                    required: true,
                    message: "Please input your mobile number!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password",
                  },
                ]}
              >
                <Input.Password className="pwd" />
              </Form.Item>

              <div className="login-forgot-link">
                <Link to="/forgot">Forgot Password</Link>
              </div>
              <Form.Item>
                <Button
                  className="login-submit-btn"
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  disabled={loading}
                >
                  Log In -&gt;
                </Button>
              </Form.Item>
            </Form>
          </div>
          <div className="login-signup-btn">
            Doesn't have an account? <Link to="/signup">Sign Up</Link>
          </div>
        </div>
        <div className="right-sec">
          <img className="login-banner-img" src={img} alt="img" />
        </div>
      </div>
    </>
  );
};

export default Login;
