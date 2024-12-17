import React from "react";
import { Button, message } from "antd";
import { PrinterOutlined } from "@ant-design/icons";

const PrintInvoiceButton = ({ orderId }) => {
	const API_BASE_URL = process.env.REACT_APP_API_URL;

	const handlePrintInvoice = async () => {
		if (!orderId) {
			message.error("Order ID is missing!");
			return;
		}

		try {
			const response = await fetch(
				`${API_BASE_URL}/generate-invoice?order_id=${orderId}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			if (!response.ok) {
				throw new Error(`Failed to fetch invoice. Status: ${response.status}`);
			}

			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);

			const link = document.createElement("a");
			link.href = url;
			link.download = `Invoice_${orderId}.pdf`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			message.success("Invoice downloaded successfully!");
		} catch (error) {
			console.error("Error downloading invoice:", error);
			message.error("Failed to download invoice. Please try again.");
		}
	};

	return (
		<Button
			type="primary"
			icon={<PrinterOutlined />}
			onClick={handlePrintInvoice}>
			Print Invoice
		</Button>
	);
};

export default PrintInvoiceButton;
