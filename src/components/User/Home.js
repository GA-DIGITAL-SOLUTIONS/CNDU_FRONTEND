import React, { useEffect, useState } from "react";
import Main from "./Layout";
import icon from "./../../images/HomePage/hero page banner.png";
import aboutimg from "./../../images/HomePage/about us.png";
import "./Home.css";
import usp1 from "./../../images/HomePage/Extensive Collection.jpg";
import usp2 from "./../../images/HomePage/Interactive Storytelling Sessions.jpg";
import usp3 from "./../../images/HomePage/Family-Friendly Environment.jpg";
import usp4 from "./../../images/HomePage/Activity Center.jpg";
import usp5 from "./../../images/HomePage/Affordable Membership.jpg";
import usp6 from "./../../images/HomePage/Community Building.jpg";
import faq from "./../../images/HomePage/faq.png";
import flowchart from "./../../images/HomePage/flowchart.png";
import testimonial from "./../../images/HomePage/bg_testimonial.png";
import { Collapse, message } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useAuth } from "../utils/useAuth";

const Home = () => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [testimonials, setTestimonials] = useState([]);
	const { apiurl, token } = useAuth();
	useEffect(() => {
		getPinnedReviews();
	}, []);
	const getPinnedReviews = async () => {
		try {
			const response = await fetch(`${apiurl}/pinnedreviews/`, {
				method: "GET",
				headers: {
					// Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});
			const data = await response.json();
			if (response.ok) {
				setTestimonials(data.data);
			} else {
				message.error(data.error);
			}
		} catch (error) {
			message.error("Failed to fetch reviews.");
		}
	};

	const toggleExpand = () => {
		setIsExpanded(!isExpanded);
	};

	const panelStyle = {
		marginBottom: 24,
		background: "#eee",
		borderRadius: "10px",
		border: "none",
	};

	const questions = [
		{
			key: "1",
			label: (
				<div className="question">
					<QuestionCircleOutlined />
					<p>What is StoryLand?</p>
				</div>
			),
			children: (
				<p className="answer">
					StoryLand is a rental library for books and activity center for kids.
				</p>
			),
			style: panelStyle,
		},
		{
			key: "2",
			label: (
				<div className="question">
					<QuestionCircleOutlined />
					<p>What are your operating hours?</p>
				</div>
			),
			children: (
				<p className="answer">
					We are open from 4PM to 7PM, Tuesday to Sunday. We are closed on
					Mondays and public holidays.
				</p>
			),
			style: panelStyle,
		},
		{
			key: "3",
			label: (
				<div className="question">
					<QuestionCircleOutlined />
					<p>Do you offer memberships?</p>
				</div>
			),
			children: (
				<p className="answer">
					Yes, we offer various membership plans suitable for different needs.
					Please visit our membership section for more details.
				</p>
			),
			style: panelStyle,
		},
		{
			key: "4",
			label: (
				<div className="question">
					<QuestionCircleOutlined />
					<p>How can I become a member?</p>
				</div>
			),
			children: (
				<p className="answer">
					Online option(Go to signup and create an account) or else you can
					message or call on 9000331561. We'll help you in creating an account
					with the membership plan of your choice.
				</p>
			),
			style: panelStyle,
		},
		{
			key: "5",
			label: (
				<div className="question">
					<QuestionCircleOutlined />
					<p>How to return books?</p>
				</div>
			),
			children: (
				<p className="answer">
					Either walk in to the library and return books or log in to your
					account and go to your oders and click on return. Our delivery/pick up person would come
					and collect the books you requested for return.
				</p>
			),
			style: panelStyle,
		},
		{
			key: "6",
			label: (
				<div className="question">
					<QuestionCircleOutlined />
					<p>Are there any activities for toddlers?</p>
				</div>
			),
			children: (
				<p className="answer">
					Absolutely! We have a range of activities tailored for toddlers,
					including story-telling sessions and interactive playtime.
				</p>
			),
			style: panelStyle,
		},
		{
			key: "7",
			label: (
				<div className="question">
					<QuestionCircleOutlined />
					<p>Can parents participate in the activities?</p>
				</div>
			),
			children: (
				<p className="answer">
					Yes, we encourage parents to join in and engage with their children
					during our sessions.
				</p>
			),
			style: panelStyle,
		},
		{
			key: "8",
			label: (
				<div className="question">
					<QuestionCircleOutlined />
					<p>How can I donate books to the library?</p>
				</div>
			),
			children: (
				<p className="answer">
					We appreciate book donations. Please contact us for more details on
					how to donate.
				</p>
			),
			style: panelStyle,
		},
		{
			key: "9",
			label: (
				<div className="question">
					<QuestionCircleOutlined />
					<p>Are there any late fees for borrowed books?</p>
				</div>
			),
			children: (
				<p className="answer">
					No, late fee would not be charged but we would appreciate timely returns for
					availability of books for other members.
				</p>
			),
			style: panelStyle,
		},
		{
			key: "10",
			label: (
				<div className="question">
					<QuestionCircleOutlined />
					<p>Do you organize any special events?</p>
				</div>
			),
			children: (
				<p className="answer">
					Stay tuned to our events calendar for any such events.
				</p>
			),
			style: panelStyle,
		},
	];

	const [current, setCurrent] = useState(0);

	const handlePrev = () => {
		setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
	};

	const handleNext = () => {
		setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
	};
	return (
		<Main>
			<div className="home-main">
				<div className="home-banner">
					<img src={icon} alt="Story Land Library" />
				</div>
				<div className="about-section" id="aboutus">
					<div className={`desc-content ${isExpanded ? "expanded" : ""}`}>
						<div className="abt-head">About Us</div>
						<span className="tab-space"></span>Story Land Library was born out
						of a deep-rooted love for books and community. Growing up, the
						library was a haven for my sister and me, a place where we could
						explore countless worlds and stories. When I moved to the US for my
						Masters, this passion only grew. I often visited local libraries and
						Barnes & Noble, gathering information for class assignments and
						indulging in books of personal interest.
						<br />
						{isExpanded && (
							<>
								<span className="tab-space"></span>What I cherished most about
								US libraries was their extensive collections catering to all age
								groups. One could spend hours at the library or borrow as many
								books as needed to enjoy at home. My understanding of children's
								activities at libraries expanded when I had my own child. When
								my son was about six months old, I discovered story-telling
								sessions at our local library. These sessions became a favorite
								for both of us. They provided my son with entertainment and me
								with an opportunity to socialize with other parents. Soon,
								library visits became a cherished part of our routine.
								<br></br>
								<span className="tab-space"></span> When my daughter was born,
								we continued this tradition. Reading became an integral part of
								our family time, not just a milestone to achieve. Both my kids
								are now avid book lovers. They were accustomed to weekly library
								visits in the US, but after moving to India, they felt a
								significant void. Unfortunately, children's libraries are rare
								here, leading parents to buy books regularly—an expensive affair
								for families with enthusiastic young readers. <br></br>
								<span className="tab-space"></span>The idea of starting a
								library and activity center in Hyderabad was born from our
								return to India. My husband, an engineer, and I, a nutritionist,
								wanted to create something that involved working with kids. This
								library and activity center is our joint effort to instill the
								joy of reading in children. We aim to make book reading a
								delightful experience, helping children bond with like-minded
								peers. <br></br>
								<span className="tab-space"></span>As Kate DiCamillo wisely
								said, "Reading should not be presented to children as a chore or
								duty. It should be offered as a special gift." We hope to make
								joyful reading a lifelong habit for kids.
							</>
						)}
						<button onClick={toggleExpand} className="read-more-btn">
							{isExpanded ? "Read Less" : "Read More"}
						</button>
					</div>

					<div className="desc-img">
						<img src={aboutimg} alt="about" />
					</div>
				</div>
				<div className="uspcontainer">
					<div className="usp-head">Why Choose Us</div>
					<div className="usp-list">
						<div className="usp-item">
							<img src={usp1}></img>
							<div className="usp-text">Extensive Collection</div>
							<p>
								A wide range of books for children of all ages, from toddlers to
								teenagers and adults.
							</p>
						</div>
						<div className="usp-item">
							<img src={usp2}></img>
							<div className="usp-text">Interactive Storytelling Sessions</div>
							<p>
								Engaging storytelling sessions that promote a love for reading.
							</p>
						</div>
						<div className="usp-item">
							<img src={usp3}></img>
							<div className="usp-text">Family-Friendly Environment</div>
							<p>
								A welcoming space where parents and children can bond over
								books.
							</p>
						</div>
						<div className="usp-item">
							<img src={usp4}></img>
							<div className="usp-text">Activity Center</div>
							<p>
								Creative and educational activities that complement reading and
								learnings.
							</p>
						</div>
						<div className="usp-item">
							<img src={usp5}></img>
							<div className="usp-text">Affordable Membership</div>
							<p>
								Cost-effective membership plans to make reading accessible to
								everyone
							</p>
						</div>
						<div className="usp-item">
							<img src={usp6}></img>
							<div className="usp-text">Community Building</div>
							<p>
								Opportunities for children to interact with peers and make new
								friends
							</p>
						</div>
					</div>
				</div>
				<div className="flowchart">
					<div className="flowchart-header">How The Tale Unfolds</div>
					<img src={flowchart}></img>
				</div>
				<div className="faq-main">
					<div className="faq-head">FAQ's</div>
					<div className="faq-layout">
						<div className="faq-content">
							<Collapse
								bordered={false}
								defaultActiveKey={["1"]}
								accordion
								items={questions}></Collapse>
						</div>
						<div className="faq-image">
							<img src={faq} alt="FAQ" />
						</div>
					</div>
				</div>

				<div className="testimonial-main">
					<div className="testimonial-bg-img">
						<img src={testimonial}></img>
					</div>
					<div className="testimonial-container">
						<div className="testimonial-header">Testimonials</div>
						<div className="testimonial-card">
							{testimonials && testimonials.length > 0 && (
								<>
									<div
										className="testimonial-arrow left-arrow"
										onClick={handlePrev}>
										&lt;
									</div>
									<div className="testimonial-content">
										<p className="boot-title">
											{testimonials[current].book.title}
										</p>
										<img
											src={`${apiurl}${testimonials[current].book.image}`}
											alt="testimonial"
											className="testimonial-image"
										/>
										<div className="testimonial-rating">
											<span>{"★".repeat(testimonials[current].rating)}</span>
											{"☆".repeat(5 - testimonials[current].rating)}
										</div>
										<p className="testimonial-quote">
											{testimonials[current].comment}
										</p>
										<div className="testimonial-name">
											- {testimonials[current].userprofile}
										</div>
									</div>
									<div
										className="testimonial-arrow right-arrow"
										onClick={handleNext}>
										&gt;
									</div>
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</Main>
	);
};

export default Home;
