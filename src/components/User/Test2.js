import React from "react";
import { useSelector } from "react-redux";
// import {authred}
const Test2 = () => {
  // const data = useSelector((state) => state.auth);


  const useraccestoken=sessionStorage.getItem("access_token")
  const role=sessionStorage.getItem("userRole")
console.log("test2 is running " )

  return (
    <>
      <h1>USER DASHBOARD </h1>
      <h2>
       role : {role}
        <br></br>
      token :   {useraccestoken}

      </h2>
      {/* <h1>
        role of the person : {user.username}
      </h1>

      <h2>name of the user : {user.role}</h2>

      <h2>
        phone no :{
          user.phone_number
        }
      </h2>
      <h2>
        accesstoken : {

        }
      </h2>
      */}
     
    </>
  );
};

export default Test2;
