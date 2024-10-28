import React from "react";
import Main from "./Layout";
import { Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import Inventory from "./Inventory";
import AddBook from "./AddBook";
import OutOfStock from "./Outofstock";
import BooksWithUsers from "./BooksWithUsers";
import Categories from "./ManageCategories";
const MainInventory = () => {
	return (
		<Main>
			<Tabs centered defaultActiveKey="1">
				<TabPane tab="Books Available" key="1">
					<Inventory></Inventory>
				</TabPane>
				<TabPane tab="Add Books" key="2">
					<AddBook></AddBook>
				</TabPane>
				<TabPane tab="Books Out of Stock" key="3">
					<OutOfStock></OutOfStock>
				</TabPane>
				<TabPane tab="Books with Users" key="4">
					<BooksWithUsers></BooksWithUsers>
				</TabPane>
				<TabPane tab="Manage Categories" key="5">
					<Categories></Categories>
				</TabPane>
			</Tabs>
		</Main>
	);
};

export default MainInventory;
