import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { Button, Form, Input, Modal, message, DatePicker} from "antd";
import FloatPlusButton from "../FloatPlusButton";
import axios from 'axios';
import useAuth from "../../hooks/useAuth";
import { addGoal } from "../../actions/actions";


const GoalPopup = () => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [targetDate, setTargetDate] = useState(null);
  const [showModal, toggleModalShow] = useState(false);
  const { token } = useAuth();
  const dispatch = useDispatch();

  const addGoalHandler = useCallback(async () => {
    try {
      const response = await axios.post('/api/add-goal', {
        amount,
        description,
        targetDate
      }, {
        headers: {
          "x-access-token": token,
        }
      });

      dispatch(addGoal(response.data)); // Assuming response contains the added goal
      message.success('Goal added successfully!');
      toggleModalShow(false); // Close modal after successful addition
    } catch (error) {
      console.error(error);
      message.error(error.message || 'Error adding goal. Please try again.');
    }
  }, [amount, description, targetDate, token, dispatch]);

  return (
    
    <div>
      <FloatPlusButton
        onclick={() => {
          toggleModalShow(true);
        }}
      />
      <Modal
        title="Add Goal"
        visible={showModal}
        onCancel={() => {
          toggleModalShow(false);
        }}
        footer={[
          <Button key="submit" type="primary" onClick={addGoalHandler}>
            Add Goal
          </Button>,
        ]}
      >
        <Form
          name="add-goal"
          initialValues={{
            category: '',
          }}
        >
          <Form.Item
            label="Amount"
            name="amount"
            rules={[
              {
                required: true,
                message: "Please enter amount!",
              },
            ]}
          >
            <Input
              placeholder="Enter amount"
              onChange={(event) => {
                setAmount(event.target.value);
              }}
            />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              {
                required: true,
                message: "Please enter a description!",
              },
            ]}
          >
            <Input.TextArea
              placeholder="Enter description"
              rows={4}
              onChange={(event) => {
                setDescription(event.target.value);
              }}
            />
          </Form.Item>
          <Form.Item
            label="Target Date"
            name="targetDate"
            rules={[
              {
                required: true,
                message: "Please select a target date!",
              },
            ]}
          >
            <DatePicker
              style={{ width: '100%' }}
              onChange={(date) => {
                setTargetDate(date);
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GoalPopup;