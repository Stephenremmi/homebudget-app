import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectEmail } from "../selectors/selectors";
import PieChart from "../components/charts/PieChart";
import LineChart from "../components/charts/LineChart";
import TransactionSummary from "../components/transaction/TransactionSummary";
import CategoryList from "../components/category/CategoryList";
import GoalList from "../components/goal/GoalList";
import {
  setCategories,
  setEmail,
  setIsMobileScreen,
  setName,
  setTransactions,
} from "../actions/actions";
import {
  CheckSquareOutlined,
  DatabaseOutlined,
  HomeOutlined,
  LineChartOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import axios from 'axios';
import { Layout, Menu, message } from "antd";
import Summary from "../components/Summary";
import { layoutStyle } from "../CommonStyles";
import CommonFooter from "../components/CommonFooter";
import CommonHeader from "../components/CommonHeader";
import useAuth from "../hooks/useAuth";

const { Content, Sider } = Layout;

const Dashboard = (props) => {
  const [loading, setLoading] = useState(true);
  const email = useSelector(selectEmail);
  const dispatch = useDispatch();
  // const isMobileScreen = useSelector(selectIsMobileScreen);
  const { token, clearStorage } = useAuth();
  

  // if (!isAuthenticated) {
  //   history.push('/login');
  //   return null;
  // }

  window.addEventListener("resize", () => {
    window.innerWidth < 600
      ? dispatch(setIsMobileScreen(true))
      : dispatch(setIsMobileScreen(false));
  });
  useEffect(() => {
    const fetchData = async () => {
        if (!loading) return; // Early return if not loading

        try {
            const response = await axios.get('/api/get-initial-data', {
              headers: {
                "x-access-token": token,
              }
            });    
            if (response.status === 200) {
                const { name, email, categories, transactions } = response.data; // Destructuring for concise variable access

                dispatch(setName(name));
                dispatch(setEmail(email));
                dispatch(setCategories(categories));
                dispatch(setTransactions(transactions));
            } else {
                throw new Error(response.data.error || 'Error fetching data. Please try again.'); // More specific error message
            }
        } catch (error) {
            console.error(error.response.data);
            // Consider displaying a user-friendly error message or handling the error in the UI/state management layer
        } finally {
            setLoading(false); // Ensure loading state is updated even on errors
        }
    };

    fetchData();
}, [loading, email, dispatch]); // Update only on changes to loading and email

  const logout = async (event) => {
    event.preventDefault();
  
    try {
      await axios.post('/api/logout', null, { headers: {
        "x-access-token": token,
      }});
  
      // Clear any relevant session data or state
      // (e.g., access tokens, user information, etc.)
      clearStorage();
  
      props.history.push('/login'); // Redirect to login page
    } catch (error) {
      console.error(error);
      message.error('Error logging out. Please try again.'); 
    }
  };

  const components = {
    home: <Summary />,
    transactions: <TransactionSummary />,
    categories: <CategoryList />,
    goals: <GoalList />,
    lineChart: <LineChart />,
    pieChart: <PieChart />,
  };

  const [ selectedActivity, setSelectedActivity] = useState("transactions");
  const selectActivity = ({ item, key, keyPath, domEvent }) => {
    setSelectedActivity(key);
  };
  return (
    <Layout style={layoutStyle}>
      <CommonHeader isLoggedIn={true} logout={logout} />
      <Layout>
        <Sider
          breakpoint="xs"
          collapsedWidth="0"
          onBreakpoint={(broken) => {
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
        >
          <Menu
            theme="dark"
            mode="inline"
            onClick={selectActivity}
            defaultSelectedKeys={["transactions"]}
          >
          
            <Menu.Item key="transactions">
              <DatabaseOutlined />
              <span>Transactions</span>
            </Menu.Item>
            <Menu.Item key="categories">
              <CheckSquareOutlined />
              <span>Categories</span>
            </Menu.Item>
            <Menu.Item key="home">
              <HomeOutlined />
              <span>Summary</span>
            </Menu.Item>
            <Menu.Item key="pieChart">
              <PieChartOutlined />
              <span>Pie Chart</span>
            </Menu.Item>
            <Menu.Item key="lineChart">
              <LineChartOutlined />
              <span>Line Chart</span>
            </Menu.Item>
            <Menu.Item key="goals">
              <LineChartOutlined />
              <span>Goals</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Content style={{ margin: "10px 5px 0" }}>
          {components[selectedActivity]}
        </Content>
      </Layout>
      <CommonFooter />
    </Layout>
  );
};

export default Dashboard;
