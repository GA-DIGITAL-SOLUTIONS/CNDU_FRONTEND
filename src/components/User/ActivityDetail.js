import React, { useEffect, useState } from "react";
import { useAuth } from "../utils/useAuth";
import { Breadcrumb, Image } from "antd";
import {
	ClockCircleOutlined,
	EnvironmentOutlined,
	CalendarOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./activitydetail.css";
import Main from "./Layout";

const ActivityDetail = () => {
	const [activity, setActivity] = useState({});
	const { apiurl, token } = useAuth();
	const { id } = useParams();
	console.log(id, "id");

	useEffect(() => {
		fetchActivity();
	}, []);

	const fetchActivity = async () => {
		const response = await fetch(`${apiurl}/activities/${id}`, {
			method: "GET",
			headers: {
				// Authorization: `Bearer ${token}`,
			},
		});
		if (response.ok) {
			const data = await response.json();
			setActivity(data.data);
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
	return (
		<Main>
			<div className="activity-detail-full-cont">
				<Breadcrumb
					items={[
						{
							title: (
								<Link to={"/activities"}>
									<CalendarOutlined />
									<span> Activities</span>
								</Link>
							),
						},
						{
							title: (
								<strong>
									<span>{activity?.name}</span>
								</strong>
							),
						},
					]}
				/>

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

export default ActivityDetail;
