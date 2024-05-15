import React, { useState } from "react";
import { Link } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { setEmail, setName } from "../actions/actions";
import Wrapper from "../components/Wrapper";
import { Button, Form, Input, Layout, Typography, message } from "antd";
import "antd/dist/antd.css";
import { LockTwoTone, MailTwoTone } from "@ant-design/icons";
import CommonFooter from "../components/CommonFooter";
import CommonHeader from "../components/CommonHeader";
import axios from 'axios';
import useAuth from "../hooks/useAuth";
// import { useCookies } from "react-cookie";
const { Content } = Layout;
const { Title } = Typography;

const Login = ({ history }) => {
  const [email, setLocalEmail] = useState("");
  const [password, setPassword] = useState("");
  // const dispatch = useDispatch();
  // const [cookies, setCookie] = useCookies(['token']);
  const { updateToken, updateUser, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    history.push('/dashboard');
    return null;
  }

  const onSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const response = await axios.post('/api/login', {
        email,
        password,
      });
  
      if (response.status === 200) {
        const { user, token } = response.data; // Destructuring for concise variable access
  
        // dispatch(setName(user.name));
        // dispatch(setEmail(user.email));

        updateUser(user);
        updateToken(token);

        console.log('Login successful!');

        history.push('/dashboard'); // Maintain single place for navigation
      } else {
        throw new Error(response.data.error || 'Login failed. Please check your credentials.'); // Provide a more specific error message
      }
    } catch (error) {
      console.error(error);
      message.error(error.message || 'Error logging in. Please try again.'); // More specific error message
    }
  };
  
  return (
    <Layout style={{ width: "100%", height: "100vh" }}>
      <CommonHeader />
      <Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Wrapper>
          <Title level={4}> Log In </Title>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
            }}
          >
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Please enter your Email!",
                },
              ]}
              hasFeedback
            >
              <Input
                prefix={<MailTwoTone className="site-form-item-icon" />}
                placeholder="yourmail@domain.com"
                onChange={(e) => setLocalEmail(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please enter your Password!",
                },
              ]}
            >
              <Input.Password
                prefix={<LockTwoTone className="site-form-item-icon" />}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>

            <Form.Item>
              <Button type={"primary"} onClick={onSubmit} block>
                Log In
              </Button>
              Don't have an account?<Link to="/signup">Create One</Link>
            </Form.Item>
          </Form>
        </Wrapper>
      </Content>
      <CommonFooter />
    </Layout>
  );
};
export default Login;
