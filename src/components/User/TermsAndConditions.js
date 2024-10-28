import React from "react";
import "./TermsAndConditions.css";
import Main from "./Layout";

const TermsAndConditions = () => {
	return (
		<Main>
			<div className="terms-container">
				<h1 className="terms-title">Terms and Conditions</h1>

				<div className="terms-content">
					<p>
						Welcome to Storyland Kids Library and Activity Centre. Our library
						is committed towards providing a safe, welcoming, and enriching
						environment for children and their families to explore, learn, and
						grow. By using our website, accessing our facilities, or
						participating in our events, you agree to comply with the following
						terms and conditions. Please read these terms carefully before using
						our services.
					</p>

					<section>
						<h2>1. Introduction</h2>
						<p>
							Storyland offers a range of services including book lending,
							activities such as storytelling sessions, workshops, events, and
							educational programs designed specifically for children. These
							Terms and Conditions are intended to ensure a positive experience
							for all library users.
						</p>
					</section>

					<section>
						<h2>2. Membership and Eligibility</h2>
						<ul>
							<li>
								Membership to Storyland is available for adults and children
								aged 0 to 18 years with parental/guardian consent mandatory for
								all ages.
							</li>
							<li>
								Membership may be subject to renewal on a periodic basis, and
								the library reserves the right to revoke membership based on
								non-compliance with these terms.
							</li>
						</ul>
					</section>

					<section>
						<h2>3. Library Services</h2>
						<ul>
							<li>
								Members can borrow books as per the library’s lending rules.
							</li>
							<li>
								Library spaces such as reading rooms must be used in a manner
								that respects other members and library property and complies
								with the library's rules.
							</li>
						</ul>
					</section>

					<section>
						<h2>4. Conduct and Usage</h2>
						<ul>
							<li>
								Library users are expected to maintain a quiet and respectful
								demeanor at all times.
							</li>
							<li>
								The library prohibits any form of harassment, bullying, or
								disruptive behavior.
							</li>
							<li>
								Members and visitors are responsible for the care and return of
								borrowed materials. Damages, or loss of materials may incur
								penalties.
							</li>
						</ul>
					</section>

					<section>
						<h2>5. Online Services</h2>
						<ul>
							<li>
								Our website and digital resources are available to members for
								educational and personal use only.
							</li>
							<li>
								Account information and passwords are to be kept confidential
								and not shared with others.
							</li>
							<li>
								The library's online content, including text, images, and
								videos, is protected by copyright and may not be reproduced
								without permission.
							</li>
						</ul>
					</section>

					<section>
						<h2>6. Intellectual Property Rights</h2>
						<p>
							All materials and online content provided by Storyland are the
							property of the library or its content providers and are protected
							by Indian and international copyright laws.
						</p>
					</section>

					<section>
						<h2>7. Disclaimer</h2>
						<ul>
							<li>
								The library makes no warranties regarding the accuracy,
								reliability, or completeness of any material or online content.
							</li>
							<li>
								Storyland shall not be liable for any damages resulting from the
								use of the library’s services or materials.
							</li>
						</ul>
					</section>

					<section>
						<h2>8. Amendments</h2>
						<p>
							These Terms and Conditions may be amended by Storyland at any
							time. Continued use of the library's services after such changes
							constitutes acceptance of the new terms.
						</p>
					</section>

					<section>
						<h2>9. Governing Law</h2>
						<p>
							These Terms and Conditions are governed by the laws of India. Any
							disputes relating to these terms will be subject to the exclusive
							jurisdiction of the courts of Pune, Maharashtra, India.
						</p>
					</section>
				</div>
			</div>
		</Main>
	);
};

export default TermsAndConditions;
