import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import Heading from "../Heading/Heading";
import { fetchUserDetails } from "../../../store/userInfoSlice";
const AccountTab = () => {
  const { apiurl, access_token } = useSelector((state) => state.auth);
	const {user,userdatasloading} =useSelector((state) => state.user)
  const [form] = Form.useForm(); // Initialize the form
	const dispatch=useDispatch()
  console.log("user",user)

  useEffect(()=>{
    if(!userdatasloading){
      form.setFieldsValue({
        username:user.username || "",
        phone_number: user.phone_number || "",
        email:user.email || "",
      });
    }
  },[userdatasloading,dispatch])

  // useEffect(() => {
  //   axios
  //     .get(`${apiurl}/user-details`, {
  //       headers: {
  //         Authorization: `Bearer ${access_token}`,
  //       },
  //     })
  //     .then((response) => {
  //       setUser(response.data.data);
  //       // Set the fetched data in the form after it is retrieved
  //       form.setFieldsValue({
  //         username: response.data.data.username || "",
  //         phone_number: response.data.data.phone_number || "",
  //         email: response.data.data.email || "",
  //       });
  //     })
  //     .catch((err) => {
  //       console.log("Failed to fetch user details");
  //     });
  // }, [access_token, apiurl, form]);



	useEffect(()=>{
		dispatch(fetchUserDetails({apiurl,access_token})).unwrap()
		.then(()=>{
		
		})
	},[apiurl])
	console.log("user",user)

  return (
		<>
    <div className="account-tab">
      <Heading>Account Information</Heading>
      <Form
        form={form} // Bind the form instance
        layout="vertical"
        className="account-form"
      >
        <Form.Item
          label="User Name"
          name="username"
        >
          <Input readOnly />
        </Form.Item>
        <Form.Item
          label="Phone Number"
          name="phone_number"
        >
          <Input readOnly />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
        >
          <Input readOnly />
        </Form.Item>
      </Form>
    </div>
		</>
		
  );
};

export default AccountTab;
