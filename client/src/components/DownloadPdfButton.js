import { DownloadOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";

const DownloadPDFButton = (props) => {
  // Specify blue color directly
  const buttonColor = props.color || "primary"; 

  return (
    <Button
      style={{
        backgroundColor: buttonColor, // Use the blue color
        borderColor: buttonColor, // Match border color to background
        color: "#fff", // White text color for contrast
        position: "absolute", // Absolute positioning for flexibility
        top: "10px", // Adjust position to top
        right: "15px", // Adjust position to right
      }}
      type={buttonColor} // Set type to match buttonColor for styling
      shape="round" // Round shape for a similar feel
      icon={<DownloadOutlined />}
      size="large"
      onClick={props.onClick}
    >
      Download
    </Button>
  );
};

export default DownloadPDFButton;