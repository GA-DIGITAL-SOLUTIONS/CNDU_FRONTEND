import React, { useState } from "react";
import { Menu, Result } from "antd";
import { AppstoreOutlined, BookOutlined } from "@ant-design/icons";
import Books from "./Books";
import Main from "./Layout";


const Catelogue = () => {
	const [selectedKey, setSelectedKey] = useState("1");

	const handleMenuClick = (e) => {
		setSelectedKey(e.key);
	};

	return (
		<Main>
			<div className="custom-container">
				<Menu
					mode="inline"
                    theme="light"
					selectedKeys={[selectedKey]}
					onClick={handleMenuClick}
					className="custom-menu">
					<Menu.Item key="1" icon={<BookOutlined />}>
						Books
					</Menu.Item>
					<Menu.Item key="2" icon={<AppstoreOutlined />}>
						Toys
					</Menu.Item>
				</Menu>
				<div className="custom-content">
					{selectedKey === "2" && (
						<Result
							status="info"
							title="Content Under Development"
							subTitle="This section is coming soon."
						/>
					)}
					{selectedKey === "1" && <Books />}
				</div>
			</div>
		</Main>
	);
};

export default Catelogue;
