import React from "react";
import { Form, Input, Button, message } from "antd";
import familyimg from "./images/image.png";
import "./Contactus.css";
import mailicon from "./images/mailicon.svg";
import phoneicon from "./images/PHONEiconn.svg";
import bannerimage from "./images/contactpagebanner.png";
import { useSelector } from "react-redux";

const Contactus = () => {
  const { apiurl } = useSelector((state) => state.auth);
  // console.log(apiurl);
  const handleSubmit = async (values) => {
    // console.log("Form Values:", values);
    try {
      const response = await fetch(`${apiurl}/get-in-touch/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const data = await response.json();
        // console.log("Server Response:", data);
        message.success("Your message has been sent successfully!");
      } else {
        console.error("Error Response:", response);
        message.error("Failed to send the message. Please try again later.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      message.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="contact-page-container">
      <div className="image-form">
        <img src={familyimg} alt="Family" className="family-image" />
        <div className="form-container">
          <Form
            className="contact-form"
            layout="vertical"
            onFinish={handleSubmit}
          >
            <h2>Get in touch!</h2>
            <p>Fill out the form and we will contact you within 24 hours.</p>

            <Form.Item
              name="fullname"
              rules={[
                { required: true, message: "Please enter your full name" },
              ]}
            >
              <Input placeholder="Enter your full name *" />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                {
                  type: "email",
                  message: "Please enter a valid email address",
                },
              ]}
            >
              <Input placeholder="Enter your email *" />
            </Form.Item>

            <Form.Item name="message">
              <Input.TextArea rows={4} placeholder="Enter your message " />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Submit form
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>

      <div className="need-help-image">
        <div className="need-help">
          <h2>Need help ?</h2>
          <p>Our team is here to help</p>
          <div className="cards-container">
            <div className="contact-cards">
              <img src={mailicon} alt="Mail Icon" />
              <h3>Drop us a line</h3>
              <p>
                Write to us if you have any difficulties in working with the
                service.
              </p>
              <Button type="primary" block>
                <a
                  href="mailto:support@example.com"
                  style={{ color: "white", textDecoration: "none" }}
                >
                  cndufabrics@gmail.com
                </a>
              </Button>
            </div>
            <div className="contact-cards callus">
              <img src={phoneicon} alt="Phone Icon" />
              <h3>Call us</h3>
              <p>
                We're here to help with all your needs and questions about the
                Finder services.
              </p>
              <Button type="primary" block>
                <a
                  href="tel:+916302235656"
                  style={{ color: "white", textDecoration: "none" }}
                >
                  +91 6302235656
                </a>
              </Button>
            </div>
          </div>
        </div>
        <img src={bannerimage} className="bannerimage" />
      </div>
    </div>
  );
};

export default Contactus;
