import React from "react";

const ReturnPolicy = () => {
  return (
    <>
      <div className="terms-container">
        <h1 className="terms-title">Return Policy</h1>
        <div className="terms-content">
          <p>
            If, for any reason, You are not completely satisfied with a purchase
            We invite You to review our policy on refunds and returns. The
            following terms are applicable for any products that You purchased
            with Us.
          </p>
          {/* <p>
          We use Your Personal data to provide and improve the Service. By
          using the Service, You agree to the collection and use of
          information in accordance with this Privacy Policy.
        </p> */}
          {/* <p>
            We will reimburse You no later than 7 days from the day on which We
            receive the returned Goods. We will use the same means of payment as
            You used for the Order, and You will not incur any fees for such
            reimbursement.
          </p> */}

          <section>
            <h2>Conditions for Returns</h2>
            <p>
              In order for the Goods to be eligible for a return, please make
              sure that:
            </p>
            <p>
              <strong>
              No Returns on Ready-Made Products – 
              </strong>
              Sarees, blouses, and dresses are not eligible for returns. Only fabrics can be considered for return or replacement.
            </p>
            <p>
              <strong>
              Replacement for Manufacturing Defects –  
              </strong>
              We accept replacements for fabrics only if they have a manufacturing defect.
            </p>
            <p>
              <strong>
              Return Request Timeline – 
              </strong>
              Customers must initiate a return request within 2 days of receiving the order.
              </p>
              <p>
              <strong>
              Proof of Damage Required – 
              </strong>
              A proper unboxing video of the package is mandatory as evidence for any damage claims.
              </p>
              <p>
              <strong>
              Customer Support Assistance –
              </strong>
              To request a return or replacement, please contact our support team for further guidance.
              </p>
          </section>

          <section>
            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Return Policy, please
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

export default ReturnPolicy;



