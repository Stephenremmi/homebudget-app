import React, { useState } from "react";
import { Link } from "react-router-dom";
import Wrapper from "../components/Wrapper";
import "antd/dist/antd.css";
import { LockTwoTone, MailTwoTone, SmileTwoTone } from "@ant-design/icons";
import { Button, Form, Input, Layout, Typography, message } from "antd";
import CommonFooter from "../components/CommonFooter";
import CommonHeader from "../components/CommonHeader";
import { layoutStyle } from "../CommonStyles";
import axios from 'axios';
import useAuth from "../hooks/useAuth";
const { Content } = Layout;
const { Title } = Typography;

const Signup = ({ history }) => {
  const [email, setLocalEmail] = useState("");
  const [name, setLocalName] = useState("");
  const [password, setPassword] = useState("");

  const { updateUser, updateToken } = useAuth(); 
  const onSubmit = async (event) => {
    event.preventDefault();
    
  
    try {
      const response = await axios.post('/api/signup', {
        name,
        email,
        password,
      }, { withCredentials: true });
  
  
      if (response.status === 200) {
        const { user, token } = response.data;

        console.log("User email:", user.email);

        updateToken(user);
        updateUser(token);



        // Assuming successful signup leads to login or other actions
        // Handle success scenario based on your application logic
        // (e.g., display success message, redirect to login page)
        console.log('Signup successful!'); // Placeholder for success handling
        history.push('/login');
      } else {
        throw new Error(response.data.error || 'Signup failed. Please check your information and try again.'); // More specific error message
      }
    } catch (error) {
      console.error(error);
      message.error(error.message || 'Error creating account. Please try again.'); // More specific error message
    }
  };

  return (
    <Layout style={layoutStyle}>
      <CommonHeader />
      <Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Wrapper>
          <Title level={4}>Sign Up</Title>
          <Form
            name="normal_signup"
            initialValues={{
              remember: true,
            }}
          >
            <Form.Item
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please enter your Name!",
                },
              ]}
            >
              <Input
                prefix={<SmileTwoTone className="site-form-item-icon" />}
                placeholder="Your Name"
                onChange={(e) => setLocalName(e.target.value)}
              />
            </Form.Item>
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

                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value) {
                      return Promise.reject("Please enter your password!");
                    }
            
                    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            
                    if (!passwordRegex.test(value)) {
                      message.error('Password must contain at least one uppercase, lowercase, digit, and special character, and be at least 8 characters long.');
                      // );');
                      // message.error(
                      //   "Password must contain at least one uppercase, lowercase, digit, and special character, and be at least 8 characters long."
                      // );
                      return Promise.reject(
                        "Password must contain at least one uppercase, lowercase, digit, and special character, and be at least 8 characters long."
                      );
                    }
            
                    return Promise.resolve();
                  },
                }),
              ]}
              hasFeedback
            >
              <Input.Password
                prefix={<LockTwoTone className="site-form-item-icon" />}
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item
              name="confirm"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      "The two passwords that you entered do not match!"
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockTwoTone className="site-form-item-icon" />}
                placeholder="Confirm Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Button type={"primary"} onClick={onSubmit} block>
                Create Account
              </Button>
              Already have an account? <Link to="/login">Log in</Link>
            </Form.Item>
          </Form>
        </Wrapper>
      </Content>
      <CommonFooter />
    </Layout>
  );
};
export default Signup;
