import React, { useEffect, useState } from "react";
import { useAuth } from "../utils/useAuth";
import { EnvironmentOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const DisplayActivities = () => {
	const [activities, setActivities] = useState([]);
	const { apiurl, token } = useAuth();

	useEffect(() => {
		fetchActivities();
	}, []);

	const fetchActivities = async () => {
		const response = await fetch(`${apiurl}/activities/`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (response.ok) {
			const data = await response.json();
			setActivities(data.data);
		}
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
		<div className="display-act">
			<div className="user-activity-main ">
				{activities.map((activity) => {
					return (
						<Link
							to={`/admin/activities/${activity.id}`}
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
									<p className="act-date-cont">{formatDate(activity.date)}</p>
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
	);
};

export default DisplayActivities;
