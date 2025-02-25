import React from "react";

const RefundPolicy = () => {
  return (
    <>
      <div className="terms-container">
        <h1 className="terms-title">Refund Policy</h1>

        <div className="terms-content">
          <p>
            We will reimburse You no later than 7 days from the day on which We
            receive the returned Goods. We will use the same means of payment as
            You used for the Order, and You will not incur any fees for such
            reimbursement.
          </p>

          <section>
            <h2>Refunds</h2>
            <p>
              Once your return is received and inspected, we will send you an
              email to notify you that we have received your returned item. We
              will also notify you of the approval or rejection of your refund.
              If approved, your refund will be processed to your original method
              of payment within 4 to 7 days, depending on your card issuer’s
              policies.
            </p>

            <h2>Damaged or Lost Returns</h2>
            <p>
						We cannot be held responsible for goods damaged or lost in return shipment. We recommend using an insured and trackable mail service to return your items. We are unable to issue a refund without actual receipt of the goods or proof of received return delivery.
            </p>
          </section>

          <section>
            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Refund Policy, please
              contact us:
            </p>
            <ul>
              <li>By email: support@cndu.in</li>
              <li>
                By visiting this page on our website:{" "}
                <a href="https://cndu.in/contact">https://cndu.in/contact</a>
              </li>
              <li>By phone number: +91 630 223 5656</li>
              <li>
                By mail: Plot No. 48, 3rd Floor, Malla Reddy Nagar,
                Gajularamaram, Hyderabad-500055, Telangana, India
              </li>
            </ul>
          </section>
        </div>
      </div>
    </>
  );
};

export default RefundPolicy;
