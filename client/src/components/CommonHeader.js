import { headerStyle } from "../CommonStyles";
import { PoweroffOutlined, UserOutlined } from "@ant-design/icons";
import React from "react";
import { Button, Layout, Popover, Typography } from 'antd';
// import { useSelector } from "react-redux";
// import { selectName } from "../selectors/selectors";
import useAuth from "../hooks/useAuth";

const { Title } = Typography;
const { Header } = Layout;

const CommonHeader = (props) => {
  // const name = useSelector(selectName);
  const { user } = useAuth();

  return (
    <Header style={headerStyle}>
      <Title level={3} style={{ color: "white", margin: 0 }}> HomeBudget</Title>

      {user?.name && (
        <div style={{ color: "white" }}>Hello {user.name}</div>
      )}

      {props.isLoggedIn && <Popover placement="bottomRight" content={<div>
        <p>Hello {user?.name}</p>
        <p><Button type="danger" icon={<PoweroffOutlined />} onClick={props.logout}>Logout</Button></p>
      </div>} trigger="click">
        <Button style={{ background: "transparent" }} icon={<UserOutlined style={{ color: "white" }} />} shape={"circle"} />
      </Popover>}
    </Header>
  )
};

export default CommonHeader;