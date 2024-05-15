  import React, { useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import {
    selectCategories,
    selectEmail,
    selectFilterDates,
  } from "../../selectors/selectors";
  import { setEmail, setName, setTransactions } from "../../actions/actions";
  import {
    DatePicker,
    Form,
    Input,
    InputNumber,
    Modal,
    Select,
    message,
  } from "antd";
  import moment from "moment";
  import axios from 'axios';
  import FloatPlusButton from "../FloatPlusButton";
  import useAuth from "../../hooks/useAuth";

  const { Option } = Select;

  const TransactionPopup = ({ setTransactionsData = () => {} }) => {
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState();
    const [date, setDate] = useState(new Date());
    const [type, setType] = useState("income");

    const categories = useSelector(selectCategories);

    const email = useSelector(selectEmail);
    const filterDates = useSelector(selectFilterDates);
    const dispatch = useDispatch();

    const types = ["income", "expense"];
    const typeCategories = {
      income: categories.filter((c) => c.type === "income").map((c) => c.name),
      expense: categories.filter((c) => c.type === "expense").map((c) => c.name),
    };
    const [category, setCategory] = useState(typeCategories["income"][0]);
    const [showModal, toggleModalShow] = useState(false);

    const { token } = useAuth();
    
    const updateTransactions = async (removeFilterDates = false) => {
      try {
        const response = await axios.post('/api/get-transactions', {
          startDate: removeFilterDates ? undefined : filterDates.startDate,
          endDate: removeFilterDates ? undefined : filterDates.endDate,
        }, {
          headers: {
            "x-access-token": token,
          }
        });
    
        if (response.status !== 200) {
          throw new Error(response.data.error || 'Error fetching transactions. Please try again.'); // More specific error message
        }
    
        const { name, email, transactions } = response.data; // Destructuring for concise variable access
    
        dispatch(setName(name));
        dispatch(setEmail(email));
        dispatch(setTransactions(transactions));

        setTransactionsData(transactions);
      } catch (error) {
        console.error(error);
        message.error(error.message || 'Error fetching transactions. Please try again.'); // Consistent error message
      }
    };

    const addTransaction = async (event) => {
      event.preventDefault();
    
      try {
        const response = await axios.post('/api/add-transaction', {
          email, // Assuming email is valid and available
          amount,
          date,
          type,
          category,
          description,
        }, {
          headers: {
            "x-access-token": token,
          }
        });
    
        if (response.status !== 200) {
          throw new Error(response.data.error || 'Error adding transaction. Please try again.'); // More specific error message
        }
    
        updateTransactions(true); // Update transactions using your existing function
        message.success('Transaction added successfully!'); // Informative success message
      } catch (error) {
        console.error(error);
        message.error(error.message || 'Error adding transaction. Please try again.'); // Consistent error message
      }
    };
    

    return (
      <div>
    
      
        <FloatPlusButton
          onclick={() => {
            toggleModalShow(true);
          }}
        />
        <Modal
          title="Add Transaction"
          visible={showModal}
          onOk={(e) => {
            addTransaction(e);
            toggleModalShow(false);
          }}
          onCancel={() => {
            toggleModalShow(false);
          }}
        >
          <div>
            <Form
              layout={"vertical"}
              name="add-transaction"
              initialValues={{
                type: type,
                date: moment(date),
                incomeCategory: typeCategories["income"][0],
                expenseCategory: typeCategories["expense"][0],
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
                <InputNumber
                  style={{ width: "100%" }}
                  min={1}
                  onChange={(value) => {
                    setAmount(value);
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Date"
                name="date"
                rules={[
                  {
                    required: true,
                    message: "Please select date!",
                  },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  onChange={(d) => {
                    d && setDate(d._d);
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Type"
                name="type"
                value={type}
                rules={[
                  {
                    required: true,
                    message: "Please select type!",
                  },
                ]}
              >
                <Select
                  value={type}
                  onChange={(value) => {
                    setType(value);
                    setCategory(typeCategories[value][0]);
                  }}
                >
                  {types.map((type) => (
                    <Option key={type}>{type}</Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) =>
                  prevValues.type !== currentValues.type
                }
              >
                {({ getFieldValue }) => {
                  return getFieldValue("type") === "income" ? (
                    <Form.Item
                      name="incomeCategory"
                      label="Category"
                      rules={[{ required: true }]}
                    >
                      <Select
                        onChange={(value) => {
                          setCategory(value);
                        }}
                      >
                        {typeCategories.income.map((c) => (
                          <Option key={c}>{c}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  ) : (
                    <Form.Item
                      name="expenseCategory"
                      label="Category"
                      rules={[{ required: true }]}
                    >
                      <Select
                        onChange={(value) => {
                          setCategory(value);
                        }}
                      >
                        {typeCategories.expense.map((c) => (
                          <Option key={c}>{c}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  );
                }}
              </Form.Item>
              <Form.Item label="Description" name="description">
                <Input
                  onChange={(event) => {
                    setDescription(event.target.value);
                  }}
                />
              </Form.Item>
            </Form>
          </div>
        </Modal>
      </div>
    );
  };

  export default TransactionPopup;
