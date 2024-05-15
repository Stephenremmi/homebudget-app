import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCategories,
  selectEmail,
  selectFilterDates,
  selectIsMobileScreen
} from "../../selectors/selectors";
import TransactionPopup from "./TransactionPopup";
import { Table, Tag, message } from "antd";
import "antd/dist/antd.css";
import TransactionModalForm from "./TransactionModalForm";
import { setEmail, setName, setTransactions } from "../../actions/actions";
import {
  DeleteTwoTone,
  EditTwoTone,
  MinusCircleTwoTone,
  PlusCircleTwoTone,
} from "@ant-design/icons";
import Filters from "../Filters";
import axios from 'axios';
import useAuth from "../../hooks/useAuth";
import PDFComponent from "./Pdf"
import 'jspdf-autotable';

const TransactionSummary = () => {
  // const transactions = useSelector(selectTransactions);
  const [transactions, setTransactionsData] = useState([]);

  const categories = useSelector(selectCategories);
  const [visible, setVisible] = useState(false);
  const [id, setId] = useState();
  const email = useSelector(selectEmail);
  const filterDates = useSelector(selectFilterDates);
  const dispatch = useDispatch();
  const isMobileScreen = useSelector(selectIsMobileScreen);

  const { token } = useAuth();

  

  const updateTransactions = async (removeFilterDates = false) => {
    try {
      const response = await axios.post('/api/get-transactions', {
        startDate: removeFilterDates ? undefined : filterDates.startDate || null,
        endDate: removeFilterDates ? undefined : filterDates.endDate || null,
      }, {
        headers: {
          "x-access-token": token,
        }
      });

      if (response.status === 200) {
        const { name, email, transactions } = response.data; // Destructuring for concise variable access

        dispatch(setName(name));
        dispatch(setEmail(email));
        dispatch(setTransactions(transactions));

        setTransactionsData(transactions);


      } else {
        throw new Error(response.data.error || 'Unknown error'); // Provide a default error message
      }
    } catch (error) {
      console.error(error);
      message.error(error.message || 'Error fetching transactions. Please try again.'); // More specific error message
    }
  };

  useEffect(() => { 
    updateTransactions(true);
  }, [])

  const addTransaction = async ({
    id,
    date,
    amount,
    type,
    category,
    description,
  }) => {
    try {
      const response = await axios.post('/api/update-transaction', {
        id,
        email,
        amount,
        date,
        type,
        category,
        description,
      },
      {
        headers: {
          "x-access-token": token,
        }
      },
      {
        withCredentials: true,
      });

      if (response.status === 200) {
        updateTransactions(); // Call the function to update UI/state
        // Display a success message
      } else {
        throw new Error(response.data.error); // Use specific error message from response
      }
    }
    catch (error) {
      console.error(error)
      message.error(error.message);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      const response = await axios.delete(`/api/delete-transaction/${id}`,
        {
          headers: {
            "x-access-token": token,
          }
        });

      if (response.status === 200) {
        updateTransactions(); // Call the function to update UI/state
        // Display a success message (optional)
      } else {
        throw new Error(response.data.error); // Use specific error message from response
      }
    } catch (error) {
      message.error(error.message); // Display a more specific error message
    }
  };

  const onCreate = (values) => {
    console.log("Received values of form: ", values);
    console.log(id);
    setVisible(false);
    const v = {
      id: id,
      date: values.date._d,
      amount: values.amount,
      type: values.type,
      category:
        values.type === "income"
          ? values.incomeCategory
          : values.expenseCategory,
      description: values.description,
    };
    addTransaction(v);
  };

  const columns = [
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      sorter: {
        compare: (a, b) => a.amount - b.amount,
      },
      render: (text) => (
        <span>
          {text.toLocaleString("en-IN", { style: "currency", currency: "KES" })}
        </span>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: {
        compare: (a, b) => new Date(a.date) - new Date(b.date),
      },
      render: (text, record) => (
        <span>{new Date(text).toLocaleDateString("en-IN")}</span>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      filters: categories.map((e) => {
        return { text: e.name, value: e.name };
      }),
      onFilter: (value, record) => record.category === value,
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <span>
          {id === record._id && (
            <TransactionModalForm
              initialValues={{
                amount: record.amount,
                date: record.date,
                type: record.type,
                expenseCategory:
                  record.type === "expense" ? record.category : undefined,
                incomeCategory:
                  record.type === "income" ? record.category : undefined,
                description: record.description,
              }}
              visible={visible}
              onCreate={onCreate}
              onCancel={() => {
                setVisible(false);
              }}
            />
          )}
          <EditTwoTone
            style={{ fontSize: 22, marginRight: 6, cursor: "pointer" }}
            onClick={() => {
              setId(record._id);
              setVisible(!visible);
            }}
          />
          <DeleteTwoTone
            twoToneColor="red"
            style={{ fontSize: 22, cursor: "pointer" }}
            onClick={() => {
              deleteTransaction(record._id);
            }}
          />
        </span>
      ),
    },
  ];

  if (!isMobileScreen) {

    columns.unshift({
      title: "Type",
      dataIndex: "type",
      key: "type",
      filters: [
        { text: "Income", value: "income" },
        { text: "Expense", value: "expense" },
      ],
      onFilter: (value, record) => record.type === value,
      render: (text) =>
        text === "income" ? (
          <Tag color="#6ca653">
            {" "}
            <PlusCircleTwoTone twoToneColor={"#6ca653"} /> Income{" "}
          </Tag>
        ) : (
          <Tag color="#f56a00">
            {" "}
            <MinusCircleTwoTone twoToneColor={"#f56a00"} /> Expense
          </Tag>
        ),
    });
  }


    return (
      
      <div>
  <Filters setTransactionsData={setTransactionsData} />
  <PDFComponent prop1={'Transactions'} />
  <TransactionPopup setTransactionsData={setTransactionsData} />
  <Table
    columns={columns}
    expandable={
      !isMobileScreen
        ? {
            expandedRowRender: (record) => (
              <span>
                <h4>Description : </h4>
                {record.description}
              </span>
            ),
          }
        : false
    }
    dataSource={transactions.map((transaction, index) => ({
      ...transaction,
      key: index, // Assigning index as the key, assuming transactions have unique indexes
    }))}
    pagination={false}
    size={"small"}
  />
</div>
    );
  };
export default TransactionSummary;
