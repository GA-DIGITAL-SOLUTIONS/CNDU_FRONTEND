import React from "react";
import Main from "./Layout";
import { Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import OfferManager from "./Offers";
import CouponCodeManager from "./Coupon";

const OfferMain = () => {
	return (
		<Main>
			<Tabs centered defaultActiveKey="1">
				<TabPane tab="Coupons(For Amount)" key="1">
					<CouponCodeManager></CouponCodeManager>
				</TabPane>
				<TabPane tab="Offers(For Months)" key="2">
					<OfferManager></OfferManager>
				</TabPane>
			</Tabs>
		</Main>
	);
};

export default OfferMain;
