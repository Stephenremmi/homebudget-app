import styled from "styled-components";
import { headerStyle } from "../CommonStyles";
import React from "react";
import {Card, Col, Row, Statistic, Typography, Layout} from "antd";
import {MinusOutlined, PlusOutlined, WalletOutlined} from '@ant-design/icons';
import {useSelector} from "react-redux";
import {selectTransactions} from "../selectors/selectors";
import PDFComponent from "./transaction/Pdf"
import useAuth from "../hooks/useAuth";
const Wrap = styled.div`
background: #ececec;
padding: 10%;
`;


const { Title } = Typography;
const { Header } = Layout;

const Summary = (props) => {
  const { user } = useAuth();
  const transactions = useSelector(selectTransactions);
  const getSummary = ({expense, income}, transaction) => {
    transaction.type === "expense" ? expense += transaction.amount : income += transaction.amount;
    return {expense, income};
  };
  let {expense, income} = transactions.reduce(getSummary, {expense: 0, income: 0});



  return (
    
    <Wrap>
      <PDFComponent prop1={'summary'}/>
      {/* <Title level={3} style={{ color: "black", margin: 0 }}> HomeBudget</Title> */}
      <Header style={headerStyle}>
      <Title level={3} style={{ color: "white", margin: 0 }}>   {user?.name} Summary Reports</Title>
      </Header>
      
      <Row gutter={16}>
        <Col span={22}>
          <Card>
            <Statistic
              title="Income"
              value={income}
              precision={2}
              valueStyle={{color: '#3f8600'}}
              prefix={<PlusOutlined/>}
              suffix="Ksh"
            />
          </Card>
        </Col>
        <Col span={22}>
          <Card>
            <Statistic
              title="Expense"
              value={expense}
              precision={2}
              valueStyle={{color: '#cf1322'}}
              prefix={<MinusOutlined/>}
              suffix="Ksh"
            />
          </Card>
        </Col>
        <Col span={22}>
          <Card>
            <Statistic
              title="Balance"
              value={income - expense}
              precision={2}
              valueStyle={{color: 'blue'}}
              prefix={<WalletOutlined/>}
              suffix="Ksh"
            />
          </Card>
        </Col>
      </Row>
    </Wrap>
    
  );
}

export default Summary;