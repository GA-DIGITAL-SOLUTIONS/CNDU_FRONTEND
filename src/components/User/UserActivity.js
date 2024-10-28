import React, { useEffect, useState } from "react";
import { useAuth } from "../utils/useAuth";
import "./useractivity.css";
import { EnvironmentOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { Link } from "react-router-dom";
import banner from "./../../images/HomePage/activities banner.jpg";
import Main from "./Layout";

const UserActivity = () => {
	const [activities, setActivities] = useState([]);
	const [filteredActivities, setFilteredActivities] = useState([]);
	const [filter, setFilter] = useState("all");
	const { apiurl, token } = useAuth();

	useEffect(() => {
		fetchActivities();
	}, []);

	useEffect(() => {
		filterActivities();
	}, [activities, filter]);

	const fetchActivities = async () => {
		const response = await fetch(`${apiurl}/activities/`, {
			method: "GET",
		});
		if (response.ok) {
			const data = await response.json();
			setActivities(data.data);
		}
	};

	const filterActivities = () => {
		const now = new Date();
		let filtered = [];
		if (filter === "upcoming") {
			filtered = activities.filter((activity) => new Date(activity.date) > now);
		} else if (filter === "past") {
			filtered = activities.filter((activity) => new Date(activity.date) < now);
		} else if (filter === "ongoing") {
			filtered = activities.filter((activity) => {
				const activityDate = new Date(activity.date);
				return activityDate.toDateString() === now.toDateString();
			});
		} else if (filter === "all") {
			filtered = activities;
		}
		setFilteredActivities(filtered);
	};

	const getMonthName = (monthNumber) => {
		const date = new Date();
		date.setMonth(monthNumber - 1);
		return date.toLocaleString("default", { month: "long" });
	};

	const formatDate = (dateString) => {
		const [year, month, day] = dateString.split("-");
		const monthName = getMonthName(parseInt(month, 10)).slice(0, 3);
		return (
			<>
				<div className="month"> {monthName} </div>
				<div className="day">{day}</div>
				<div className="year">{year}</div>
			</>
		);
	};

	return (
		<Main>
			<div className="user-activity-main">
				<div className="banner">
					<img src={banner}></img>
				</div>
				<div className="display-act">
					<div className="section-1">
					
						<div className="filter-buttons">
							<Button
								type={filter === "all" ? "primary" : "default"}
								onClick={() => setFilter("all")}>
								All
							</Button>
							<Button
								type={filter === "upcoming" ? "primary" : "default"}
								onClick={() => setFilter("upcoming")}>
								Upcoming
							</Button>
							<Button
								type={filter === "past" ? "primary" : "default"}
								onClick={() => setFilter("past")}>
								Past
							</Button>
							<Button
								type={filter === "ongoing" ? "primary" : "default"}
								onClick={() => setFilter("ongoing")}>
								Ongoing
							</Button>
						</div>
					</div>
					<div className="user-activity-main">
						{ filteredActivities.map((activity) => {
							return (
								<Link
									to={`/activities/${activity.id}`}
									key={activity.id}
									className="activity-link">
									<div className="activity-card">
										<img
											className="img1"
											src={`${apiurl}${
												activity.images[0]?.image || "/default-image.jpg"
											}`}
											alt="activity"
										/>
										<div className="activity-details">
											<p className="act-date-cont">
												{formatDate(activity.date)}
											</p>
											<div>
												<p className="act-name">{activity.name}</p>
												<p className="location">
													<EnvironmentOutlined /> {activity.location}
												</p>
												<p className="act-desc">
													{activity.description.slice(0, 50)}
													{"..."}
												</p>
											</div>
										</div>
									</div>
								</Link>
							);
						})}
					</div>
				</div>
			</div>
		</Main>
	);
};

export default UserActivity;
