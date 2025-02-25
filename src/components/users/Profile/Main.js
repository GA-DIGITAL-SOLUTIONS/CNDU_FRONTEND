import React, { useState, useEffect } from "react";
import { Tabs, Grid } from "antd";
import { useSearchParams } from "react-router-dom"; // ✅ Import this
import AccountTab from "./AccountTab";
import "./style.css";
import Address from "./Address";
import LogoutTab from "./Logout";
import PasswordTab from "./PasswordTab";
import OrdersTab from "./OrdersTab";
import WishlistTab from "./WishlistTab";
import Returns from "./Returns";

const { TabPane } = Tabs;
const { useBreakpoint } = Grid;

const UserAccount = () => {
  const screens = useBreakpoint();
  const [tabPosition, setTabPosition] = useState("left");
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("1");

  const tabLabels = {
    1: "Account",
    2: "Password",
    3: "Address",
    4: "Orders",
    5: "Returns",
    6: "Wishlist",
    7: "Log Out",
  };

  useEffect(() => {
    setTabPosition(screens.md ? "left" : "top");
  }, [screens]);

  useEffect(() => {
    const tabValue = searchParams.get("tab");

    if (tabValue) {
      const foundKey = Object.keys(tabLabels).find(
        (key) => tabLabels[key] === tabValue
      );

      if (foundKey) {
        setActiveTab(foundKey);
      }
    }
  }, [searchParams]);

  const handleTabChange = (key) => {
    console.log("Switched to tab:", tabLabels[key]);
    setActiveTab(key);
    setSearchParams({ tab: tabLabels[key] });
  };

  return (
    <div className="user-account">
      <img
        alt="productbanner"
        src="./productpageBanner.png"
        className="banner"
      />
      <div className="tabs-container">
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          tabPosition={tabPosition}
          className="custom-tabs"
          tabBarGutter={16}
          type="line"
          tabBarStyle={{
            overflowX: "auto",
            whiteSpace: "nowrap",
          }}
        >
          {Object.entries(tabLabels).map(([key, label]) => (
            <TabPane tab={label} key={key}>
              <div className="tab-content">
                {key === "1" && <AccountTab />}
                {key === "2" && <PasswordTab />}
                {key === "3" && <Address />}
                {key === "4" && <OrdersTab />}
                {key === "5" && <Returns />}
                {key === "6" && <WishlistTab />}
                {key === "7" && <LogoutTab />}
              </div>
            </TabPane>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default UserAccount;
