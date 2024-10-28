import React, { useEffect, useState } from "react";
import { useAuth } from "../utils/useAuth";
import {
	ClockCircleOutlined,
	EnvironmentOutlined,
	CalendarOutlined,
} from "@ant-design/icons";
import "./act.css";
import { useNavigate, useParams } from "react-router-dom";
import Main from "./Layout";
import { Button, message, Popconfirm } from "antd";

const Activity = () => {
	const [activity, setActivity] = useState({});
	const { apiurl, token } = useAuth();
	const { id } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		fetchActivity();
	}, []);

	const fetchActivity = async () => {
		const response = await fetch(`${apiurl}/activities/${id}`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (response.ok) {
			const data = await response.json();
			setActivity(data.data);
			console.log(activity);
		}
	};
	const formatTime = (time) => {
		const date = new Date(`1970-01-01T${time}Z`);
		return date.toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "numeric",
			hour12: true,
		});
	};
	const formatDate = (dateString) => {
		const [year, month, day] = dateString.split("-");
		return `${day}-${month}-${year}`;
	};

	const handledelete = async () => {
		const response = await fetch(`${apiurl}/activities/`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ id: id }),
		});
		const data = await response.json();
		if (response.ok) {
			message.success(data.message);
			navigate("/admin/activities");
		} else {
			message.error(data.error);
		}
	};
	return (
		<Main>
			<div className="activity-detail-full-cont admin-act-detail">
				<div className="detail-activty-card">
					<div className="activity-full-cont">
						<div className="act-cont">
							{activity?.images?.length > 0 && (
								<img
									className="activity-img"
									src={`${apiurl}${activity?.images[0]?.image}`}
									alt="activity"
								/>
							)}
							<pre className="act-desc">{activity?.description}</pre>
						</div>

						<div className="act-details">
							<p className="act-name"> {activity.name}</p>
							<p className="date-cont">
								<strong>
									<p>Date</p>
								</strong>
								<CalendarOutlined />{" "}
								{activity.date && formatDate(activity.date)}
							</p>
							<p className="date-cont">
								<strong>
									<p>Timings</p>
								</strong>
								<ClockCircleOutlined /> {formatTime(activity.start_time)} to{" "}
								{formatTime(activity.end_time)}
							</p>{" "}
							<p className="date-cont">
								<strong>
									<p>Location</p>
								</strong>
								<EnvironmentOutlined /> {activity?.location}
							</p>
							<Popconfirm
								title="Are you sure to delete this item?"
								onConfirm={handledelete}
								okText="Yes"
								cancelText="No">
								<Button className="actdeletebtn">Delete</Button>
							</Popconfirm>
						</div>
					</div>
					<center>
						<h1>Gallery</h1>
					</center>
					<div className="gallery">
						{activity?.images?.map((image) => {
							return (
								<div className="gallery-item">
									<img
										className="gallery-image"
										src={`${apiurl}${image.image}`}
										alt="activity"
									/>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</Main>
	);
};

export default Activity;
