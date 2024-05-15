import React, { useEffect, useState } from "react";
import { message, Table, Tag } from "antd";
import {
  DeleteTwoTone,
  EditTwoTone,
} from "@ant-design/icons";
import GoalPopup from "./GoalPopup";
import axios from 'axios';
import useAuth from "../../hooks/useAuth";

const GoalList = () => {
  const [goals, setGoals] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const { token } = useAuth();

  const updateGoals = async () => {
    try {
      const response = await axios.post('/api/get-goals', {
      },
      {
          headers: {
          "x-access-token": token,
        }
      });

      setGoals(response.data);
      console.log(response.data)
    } catch (error) {
      console.error(error);
      message.error(error.message || 'Error fetching goals. Please try again.');
    }
  };

  useEffect(() => {
    updateGoals();
  }, []);

  const deleteGoal = async (id) => {
    try {
      const response = await axios.delete(`api/delete-goal/${id}`, {
        headers: {
          "x-access-token": token,
        }
      });

      if (response.status !== 200) {
        throw new Error(response.data.error || 'Error deleting goal. Please try again.');
      }

      updateGoals();
      message.success('Goal deleted successfully!');
    } catch (error) {
      console.error(error);
      message.error(error.message || 'Error deleting goal. Please try again.');
    }
  };

  const showModal = (goal) => {
    setSelectedGoal(goal);
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const addGoal = async (newGoal) => {
    try {
      const response = await axios.post('/api/add-goal', newGoal, {
        headers: {
          "x-access-token": token,
        }
      });

      if (response.status !== 200) {
        throw new Error(response.data.error || 'Error adding goal. Please try again.');
      }

      updateGoals();
      setVisible(false);
      message.success('Goal added successfully!');
    } catch (error) {
      console.error(error);
      message.error(error.message || 'Error adding goal. Please try again.');
    }
  };

  const columns = [
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Target Date",
      dataIndex: "targetDate",
      key: "targetDate",
    },
    {
      title: "Complete",
      dataIndex: "complete",
      key: "complete",
      render: complete => (
        <Tag color={complete ? "green" : "red"}>
          {complete ? "Complete" : "Incomplete"}
        </Tag>
      ),
    },

    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <span>
          <DeleteTwoTone
            twoToneColor="red"
            style={{ fontSize: 22, cursor: "pointer" }}
            onClick={() => deleteGoal(record.id)}
          />
        </span>
      ),
    },
  ];

  return (
    <div>
      
      <GoalPopup
        visible={visible}
        setVisible={setVisible}
        selectedGoal={selectedGoal}
        updateGoals={updateGoals}
        addGoal={addGoal}
      />
      <Table
        columns={columns}
        dataSource={goals}
        pagination={false}
        size="middle"
      />
    </div>
  );
};

export default GoalList;