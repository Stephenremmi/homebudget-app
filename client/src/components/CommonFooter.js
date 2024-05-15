import { Button, Layout, Space } from "antd";
import React from "react";
import { FacebookFilled, GithubFilled, InstagramOutlined } from "@ant-design/icons";
import { footerStyle } from "../CommonStyles";

const {Footer} = Layout;

const SocialMediaLinks = () => (
  <Space>
    <a
      href="https://github.com/stephenremmi/homebudget"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Button type="primary" shape="circle" icon={<GithubFilled />} />
    </a>
    <Button type="primary" shape="circle" icon={<InstagramOutlined />} />
    <Button type="primary" shape="circle" icon={<FacebookFilled />} />
  </Space>
);

const CommonFooter = () => (
  <Footer style={footerStyle}>
    <SocialMediaLinks />
  </Footer>
);

export default CommonFooter;
