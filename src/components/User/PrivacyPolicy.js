import React from "react";
import "./TermsAndConditions.css";
import Main from "./Layout";
import Heading from "../users/Heading/Heading";
const PrivacyPolicy = () => {
	return (
		<Main>
			<div className="terms-container">
			<Heading>
			<h1 className="terms-title">Privacy Policy</h1>
			</Heading>
				<div className="terms-content">
					<p>
						Storyland Library is committed to protecting the privacy and
						security of all our members. This Privacy Policy explains how we
						collect, use, disclose, and safeguard your information when you
						visit our physical library, use our online services, or interact
						with us. We invite you to read this policy carefully.
					</p>

					<section>
						<h2>1. Acknowledgement and Acceptance of Terms</h2>
						<p>
							We are committed to protecting your privacy. This Privacy Policy
							sets forth our current privacy practices regarding information we
							collect when you or your computer interact with our library. By
							accessing Storyland, you acknowledge and fully understand our
							Privacy Policy and freely consent to the information collection
							and use practices described in this website Privacy Policy.
						</p>
					</section>

					<section>
						<h2>2. Information We Collect</h2>
						<ul>
							<li>
								Personal Information: Includes name, age, address, phone number,
								and email.
							</li>
							<li>
								Library Usage Information: Details about the books borrowed,
								activities participated in, and usage of library resources.
							</li>
							<li>
								Digital Interaction Data: Information on how you use our website
								and online services, including IP addresses and cookies, where
								applicable.
							</li>
						</ul>
					</section>

					<section>
						<h2>3. How We Use Your Information</h2>
						<ul>
							<li>To manage library membership and book lending services.</li>
							<li>
								To inform you about library updates, events, and new resources.
							</li>
							<li>
								To improve our library services and address your needs and
								preferences.
							</li>
						</ul>
					</section>

					<section>
						<h2>4. Sharing of Personal Information</h2>
						<ul>
							<li>
								Your information is not sold, traded, or rented to others.
							</li>
							<li>
								We may share information with government bodies as required by
								law or to protect the library and its members.
							</li>
							<li>
								We have partnered with companies/agents/contractors to perform
								various functions such as web development, logistics, etc. In
								the course of providing such services, they may gain access to
								part or whole of your personal information. For example: Your
								contact numbers will be used only for order and delivery-related
								purposes. Storyland will not be liable for any damages that may
								result from the misuse of your personal information by these
								companies. For all other purposes, we will communicate with you
								only through the designated email address/WhatsApp number that
								you share with us.
							</li>
						</ul>
					</section>

					<section>
						<h2>5. Data Security</h2>
						<p>
							We employ reasonable security measures to protect your information
							from unauthorized access, disclosure, alteration, and destruction.
						</p>
					</section>

					<section>
						<h2>6. Children's Privacy</h2>
						<p>
							Protecting children’s privacy is especially important to us. We do
							not collect or solicit personal information from any child without
							parental consent.
						</p>
					</section>

					<section>
						<h2>7. Your Rights</h2>
						<ul>
							<li>
								You have the right to request access to the personal information
								we hold about you and ask for it to be corrected or deleted.
							</li>
							<li>
								You can opt-out of receiving promotional communications from us
								at any time.
							</li>
						</ul>
					</section>

					<section>
						<h2>8. Changes to this Privacy Policy</h2>
						<p>
							We may update this Privacy Policy to reflect changes to our
							information practices. We will notify you by posting an
							announcement on our website or sending you an email.
						</p>
					</section>

					<section>
						<h2>9. Contacting Us</h2>
						<p>
							If you have any questions about this Privacy Policy, our
							practices, or your dealings with Storyland, please contact us at:
							+91 9000331561
						</p>
					</section>
				</div>
			</div>
		</Main>
	);
};

export default PrivacyPolicy;
