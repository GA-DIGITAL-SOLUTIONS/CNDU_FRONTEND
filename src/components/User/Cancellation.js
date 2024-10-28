import React from "react";
import "./TermsAndConditions.css";
import Main from "./Layout";

const CancellationPolicy = () => {
	return (
		<Main>
			<div className="terms-container">
				<h1 className="terms-title">Refunds, Cancellations and Pricing</h1>

				<div className="terms-content">
					<p>
						Welcome to Storyland Library and Activity Centre, where we are
						passionate about fostering a love for reading and learning among
						children. Our library offers a variety of memberships, services, and
						programs designed to meet the needs of our young readers and their
						families. Below, you'll find detailed information about our pricing,
						refund, and cancellation policies.
					</p>

					<section>
						<h2>Payment Policy</h2>
						<ul>
							<li>
								Payment can be made using online payment methods, debit card, or
								cash.
							</li>
							<li>
								People willing to enroll as a member of Storyland Library must
								pay a one-time non-refundable “Registration fee” of Rs. 200.
							</li>
							<li>
								Storyland Members must pay a “Refundable security deposit” based
								upon the subscription plan chosen by them. This deposit will be
								refunded when the members terminate the membership after
								deduction of dues (if any) to the library.
							</li>
							<li>
								Subscription Fee must be paid within a week from the membership
								renewal date. Only after payment of the Subscription fee,
								members are entitled to borrow products for use.
							</li>
							<li>
								Registration fee and Subscription fee once paid are
								non-refundable under any circumstance.
							</li>
							<li>
								Members cannot claim any compensation in any form from Storyland
								in case of delay in home delivery/pickup of any product and also
								in case of non-availability of any product in circulation.
							</li>
						</ul>
						<p>
							All memberships and program fees are payable upfront and are
							non-transferable and non-refundable.
						</p>
					</section>

					<section>
						<h2>Refund Policy</h2>
						<ul>
							<li>
								<strong>Membership Fees:</strong>
								<ul>
									<li>
										Membership fees are non-refundable but membership can be
										frozen for a limited time upon special request.
									</li>
								</ul>
							</li>
							<li>
								<strong>Event Fees:</strong>
								<ul>
									<li>
										If you cancel your enrollment in any of our events at least
										5 days before the event start date, you will receive a 50%
										refund.
									</li>
									<li>
										Cancellations made less than 5 days before the start date
										will be non-refundable.
									</li>
								</ul>
							</li>
						</ul>
					</section>

					<section>
						<h2>Cancellation Policy</h2>
						<ul>
							<li>
								Members may cancel their membership by visiting the library and
								returning all borrowed books.
							</li>
							<li>
								Members may cancel event enrollments by contacting the library
								at +91 9000331561.
							</li>
						</ul>
					</section>

					<section>
						<h2>Damages</h2>
						<p>
							Members are responsible for costs associated with the replacement
							of damaged or lost books.
						</p>
					</section>

					<section>
						<h2>Pricing Changes</h2>
						<p>
							Storyland reserves the right to modify membership and program fees
							at any time. Any changes will be communicated to our members
							through our website and WhatsApp at least 30 days before taking
							effect.
						</p>
					</section>
				</div>
			</div>
		</Main>
	);
};

export default CancellationPolicy;
