import React from "react";
import CanvasJSReact from "@canvasjs/react-charts";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const AdminGraph = () => {
  const options = {
    animationEnabled: true,
    title: {
      text: "Monthly Sales - 2017",
    },
    axisX: {
      valueFormatString: "MMM",
    },
    axisY: {
      title: "Sales (in USD)",
      prefix: "$",
    },
    data: [
      {
        type: "spline", // Type of chart
        markerType: "none", // Removes the dots
        lineColor: "#ff0044", // Sets the line color to pink
        yValueFormatString: "$#,###",
        xValueFormatString: "MMMM",
        lineThickness:4,
        dataPoints: [
          { x: new Date(2017, 0), y: 25060 },
          { x: new Date(2017, 1), y: 27980 },
          { x: new Date(2017, 2), y: 42800 },
          { x: new Date(2017, 3), y: 32400 },
          { x: new Date(2017, 4), y: 35260 },
          { x: new Date(2017, 5), y: 33900 },
          { x: new Date(2017, 6), y: 40000 },
          { x: new Date(2017, 7), y: 52500 },
          { x: new Date(2017, 8), y: 32300 },
          { x: new Date(2017, 9), y: 42000 },
          { x: new Date(2017, 10), y: 37160 },
          { x: new Date(2017, 11), y: 38400 },
        ],
      },
    ],
  };

  return (
    <div style={{ width: "700px", margin: "0 auto" }}>
      <CanvasJSChart options={options} />
    </div>
  );
};

export default AdminGraph;
