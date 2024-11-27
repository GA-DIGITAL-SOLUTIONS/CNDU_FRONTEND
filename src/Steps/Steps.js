
import React, { useState } from "react";
import { Steps, Button } from "antd";
import "./Steps.css"; 

const { Step } = Steps;

const AntdSteps = () => {
  const [currentStep, setCurrentStep] = useState(0);

  // Steps data
  const steps = [
    {
      title: "Shopping Cart",
    },
    {
      title: "Checkout Details",
    },
    {
      title: "Order Complete",
    },
  ];

  // Step navigation handlers
  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div style={{ margin: "20px" }}>
      <Steps current={currentStep}>
        {steps.map((step, index) => (
          <Step
            key={index}
            title={step.title}
            className={
              currentStep === index
                ? "active-step"
                : currentStep > index
                ? "completed-step"
                : "next-step"
            }
          />
        ))}
      </Steps>

      <div style={{ marginTop: "20px" }}>
        <div>
          {currentStep === 0 && <p>Your Shopping Cart details go here...</p>}
          {currentStep === 1 && <p>Your Checkout Details form goes here...</p>}
          {currentStep === 2 && <p>Your Order Completion details go here...</p>}
        </div>

        <div style={{ marginTop: "20px" }}>
          <Button
            type="primary"
            onClick={prev}
            disabled={currentStep === 0}
            style={{ marginRight: "10px" }}
          >
            Previous
          </Button>
          <Button
            type="primary"
            onClick={next}
            disabled={currentStep === steps.length - 1}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AntdSteps;
