import React, { useState, useEffect } from "react";
import { useAuth } from "../utils/useAuth";
import { Button, Radio, message, Select } from "antd";
import "./Subscriptions.css";
import Main from "./Layout";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const Subscriptions = () => {
	const { apiurl, token } = useAuth();
	const [currentPlan, setCurrentPlan] = useState({});
	const [plans, setPlans] = useState([]);
	const [selectedPlan, setSelectedPlan] = useState(null);
	const [loading, setLoading] = useState(false);
	const [activeTab, setActiveTab] = useState("Books Only Plan");
	const [coupons, setCoupons] = useState([]);
	const [selectedCoupon, setSelectedCoupon] = useState(null);
	const [discountedAmount, setDiscountedAmount] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		fetchSubscription();
		fetchSubscriptionPlans();
		fetchCoupons(); // Fetch available coupons on component load
	}, []);

	const loadScript = () => {
		return new Promise((resolve) => {
			const script = document.createElement("script");
			script.src = "https://checkout.razorpay.com/v1/checkout.js";
			script.onload = () => {
				resolve(true);
			};
			script.onerror = () => {
				resolve(false);
			};
			document.body.appendChild(script);
		});
	};

	const showRazorpay = async (id) => {
		setLoading(true);
		const res = await loadScript();
		if (!res) {
			message.error("Razorpay SDK failed to load. Are you online?");
			setLoading(false);
			return;
		}
		const response = await fetch(`${apiurl}/pay/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				subscription_plan: id,
				code: selectedCoupon ? selectedCoupon.code : null,
				new: false,
			}),
		});

		const data = await response.json();
		if (response.ok) {
			const options = {
				key: process.env.REACT_APP_PUBLIC_KEY,
				amount: data.payment.amount,
				currency: "INR",
				name: "STORYLAND LIBRARY AND ACTIVITY CENTRE",
				description: "Test transaction",
				order_id: data.payment.id,
				handler: function (response) {
					onFinish(response, id);
				},
				prefill: {
					name: "User's name",
					email: "User's email",
					contact: "User's phone",
				},
				notes: {
					address: "Razorpay Corporate Office",
				},
				theme: {
					color: "#3399cc",
				},
			};
			var rzp1 = new window.Razorpay(options);
			rzp1.open();
		} else {
			message.error("Please Login First.");
			setLoading(false);
		}
	};

	const onFinish = async (response, id) => {
		const allValues = {
			subscription_plan: id,
			response: JSON.stringify(response),
			coupon: selectedCoupon ? selectedCoupon.code : null,
		};

		if (!token) {
			return message.error("Please login to wishlist books");
		}

		try {
			setLoading(true);
			const response = await fetch(`${apiurl}/upgrade/`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(allValues),
			});

			if (response.ok) {
				const data = await response.json();
				message.success(data.success, 30);
				setLoading(false);
				fetchSubscription();
				window.location.reload();
			} else {
				setLoading(false);
				const errorData = await response.json();
				message.error(errorData.message);
			}
		} catch (error) {
			setLoading(false);
			message.error(error.message);
		}
	};

	const fetchSubscription = async () => {
		try {
			const response = await fetch(`${apiurl}/usersubscription/`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			if (response.ok) {
				const data = await response.json();
				setCurrentPlan(data);
			}
		} catch {
			// console.log("Error fetching subscription");
		}
	};

	const fetchSubscriptionPlans = async () => {
		try {
			const response = await fetch(`${apiurl}/subscriptionplans/`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (response.ok) {
				const data = await response.json();
				setPlans(data.data);
			}
		} catch {
			// console.log("Error fetching subscription plans");
		}
	};

	const fetchCoupons = async () => {
		try {
			const response = await fetch(`${apiurl}/copouncodes/`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (response.ok) {
				const data = await response.json();
				setCoupons(data.data);
			}
		} catch {
			// console.log("Error fetching coupons");
		}
	};

	const handleTabChange = (tab) => {
		setActiveTab(tab);
		setSelectedPlan(null);
		setSelectedCoupon(null);
	};

	const mapTabToType = (tab) => {
		switch (tab) {
			case "Toys Only Plan":
				return "toys";
			case "Toys + Books Plan":
				return "both";
			case "Books Only Plan":
				return "books";
			default:
				return "";
		}
	};

	const handleCouponChange = (value) => {
		const coupon = coupons.find((c) => c.code === value);
		setSelectedCoupon(coupon);
		if (selectedPlan && coupon) {
			const price = parseFloat(selectedPlan.price);
			const cautionDeposit = parseFloat(selectedPlan.caution_deposit);
			const discountPercentage = parseFloat(coupon.amount);
			const totalAmount = price + cautionDeposit;
			const discountAmount = (totalAmount * discountPercentage) / 100;
			const discountedAmount = totalAmount - discountAmount;
			setDiscountedAmount(discountedAmount);
		} else {
			setDiscountedAmount(null);
		}
	};

	// Modify the isLowerPlan function to handle expired plans
	const isLowerPlan = (plan) => {
		if (currentPlan.data && currentPlan.data.price && plan.price) {
			return plan.price < currentPlan.data.price;
		}
		return false;
	};

	// Allow selection of any plan if the current plan is inactive
	const canSelectAnyPlan = !currentPlan.is_active;

	return (
		<Main>
			<div className="subscriptions-container">
				<div className="all-plans-title">Membership Plans</div>
				{currentPlan.data && (
					<div className="current-plan-details">
						<h3>Current Plan Details</h3>
						<div>
							<p>
								<span>Name:</span> {currentPlan.data.name}
							</p>
							<p>
								<span>Duration:</span> {currentPlan.data.duration}
							</p>
							<p>
								<span>Items Borrowed:</span> {currentPlan.data.books_allowed}
							</p>
							<p>
								<span>Start Date:</span> {currentPlan.start}
							</p>
							<p>
								<span>End Date:</span> {currentPlan.end}
							</p>
							<br></br>
							{currentPlan.is_active ? null : (
								<p className="plan-expired-message">
									Your plan has expired. Please select a new plan.
								</p>
							)}
						</div>
					</div>
				)}
				<div className="tabs-container">
					<div
						className={`tab-item ${
							activeTab === "Books Only Plan" ? "active" : ""
						}`}
						onClick={() => handleTabChange("Books Only Plan")}>
						Books Only Plan
					</div>
					<div
						className={`tab-item ${
							activeTab === "Toys Only Plan" ? "active" : ""
						}`}
						onClick={() => handleTabChange("Toys Only Plan")}>
						Toys Only Plan
					</div>
					<div
						className={`tab-item ${
							activeTab === "Toys + Books Plan" ? "active" : ""
						}`}
						onClick={() => handleTabChange("Toys + Books Plan")}>
						Toys + Books Plan
					</div>
				</div>
				<div className="plans-table">
					<table>
						<thead>
							<tr>
								<th>Plan Name</th>
								<th>Duration</th>
								<th>Items Borrowed at a Time</th>
								<th>Subscription Fees</th>
								<th>Refundable Deposit</th>
								<th>Select</th>
							</tr>
						</thead>
						<tbody>
							{plans &&
								plans
									.filter((plan) => plan.s_type === mapTabToType(activeTab))
									.map((plan) => (
										<tr
											key={plan.id}
											className={
												!currentPlan.is_active &&
												currentPlan.data?.id === plan.id
													? ""
													: currentPlan.data?.id === plan.id
													? "current-plan"
													: ""
											}>
											<td>{plan.name}</td>
											<td>
												{plan.duration}{" "}
												{plan.offer ? `+ ${plan.offer.no_of_months_free}` : ""}{" "}
												Months
											</td>
											<td>{plan.books_allowed}</td>
											<td>₹{plan.price}</td>
											<td>₹{plan.caution_deposit}</td>
											<td>
												<Radio
													checked={selectedPlan?.id === plan.id}
													disabled={
														(!canSelectAnyPlan &&
															currentPlan.data?.id === plan.id) ||
														(!canSelectAnyPlan && isLowerPlan(plan))
													}
													onChange={() => setSelectedPlan(plan)}
												/>
											</td>
										</tr>
									))}
						</tbody>
					</table>
				</div>
				{selectedPlan && (
					<div className="selected-plan-details">
						<h3>Selected Plan Details</h3>
						<div>
							<p>
								<strong>Name:</strong> {selectedPlan.name}
							</p>
							<p>
								<strong>Duration:</strong> {selectedPlan.duration}
							</p>
							<p>
								<strong>Items Borrowed:</strong> {selectedPlan.books_allowed}
							</p>
							<p>
								<strong>Subscription Fees:</strong> ₹{selectedPlan.price}
							</p>
							<p>
								<strong>Refundable Deposit:</strong> ₹{" "}
								{selectedPlan.caution_deposit}
							</p>
						</div>
						<Select
							placeholder="Select a coupon"
							onChange={handleCouponChange}
							style={{ width: 200 }}
							value={selectedCoupon ? selectedCoupon.code : undefined}>
							{coupons.map((coupon) => (
								<Option key={coupon.code} value={coupon.code}>
									{coupon.code} - {coupon.discount}%
								</Option>
							))}
						</Select>
						{discountedAmount !== null && (
							<p>
								<strong>After Discount:</strong> ₹ {discountedAmount}
							</p>
						)}
						<Button
							type="primary"
							loading={loading}
							onClick={() => showRazorpay(selectedPlan.id)}>
							Proceed to Payment
						</Button>
					</div>
				)}
			</div>
		</Main>
	);
};

export default Subscriptions;
