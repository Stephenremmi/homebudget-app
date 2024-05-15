import {PlusOutlined} from "@ant-design/icons";
import {Button} from "antd";
import React from "react";

const FloatPlusButton = (props) => {
  return (<Button style={{
    width: "80px",
    height: "80px",
    position: "fixed",
    fontSize: 30,
    bottom: "20%",
    right: "15%",
    boxShadow: "2px 2px 2px #999"
  }}
                  type="primary"
                  shape="circle"
                  icon={<PlusOutlined/>}
                  size={"large"}
                  onClick={props.onclick}
  />);
};
export default FloatPlusButton;