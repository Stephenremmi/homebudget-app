import React, { useEffect, useState } from "react";
// import { selectEmail } from "../../selectors/selectors";
// import { useDispatch, useSelector } from "react-redux";
import { message, Table, Tag } from "antd";
import {
  DeleteTwoTone,
  MinusCircleTwoTone,
  PlusCircleTwoTone,
} from "@ant-design/icons";
import CategoryPopup from "./CategoryPopup";
import axios from 'axios';
import useAuth from "../../hooks/useAuth";
const CategoryList = (props) => {
  const [categories, setCategoriesData] = useState([]);
  // const email = useSelector(selectEmail);
  // const dispatch = useDispatch();

  const { token} = useAuth();

const updateCategories = async () => {
  try {
    const response = await axios.post('/api/get-categories', {

    },
    { headers: {
        "x-access-token": token,
      }});

    // if (response.status !== 200) {
    //   throw new Error(response.data.error || 'Error fetching categories. Please try again.'); // More specific error message
    // }

    // dispatch(setCategories(response.data.categories));
    setCategoriesData(response.data.categories);
  } 
  catch (error) {
    console.error(error);
    message.error(error.message || 'Error fetching categories. Please try again.'); // More specific error message
  }
};
useEffect(() => {
  updateCategories();
})

const deleteCategory = async (id) => {
  try {
    const response = await axios.delete(`/api/delete-category/${id}`,
     {
      headers: {
        "x-access-token": token,
      }
  });

    if (response.status !== 200) {
      throw new Error(response.data.error || 'Error deleting category. Please try again.'); // More specific error message
    }

    updateCategories();
    message.success('Category deleted successfully!');
  } catch (error) {
    console.error(error);
    message.error(error.message || 'Error deleting category. Please try again.'); // Consistent error message
  }
};

  const columns = [
    {
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
    },
    {
      title: "Category",
      dataIndex: "name",
      key: "category",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <span>
          <DeleteTwoTone
            twoToneColor="red"
            style={{ fontSize: 22, cursor: "pointer" }}
            onClick={() => {
              deleteCategory(record._id);
            }}
          />
        </span>
      ),
    },
  ];

  return (
     <div>
    <CategoryPopup />
    <Table
      columns={columns}
      dataSource={categories}
      pagination={false}
      size={"middle"}
      rowKey={(record, index) => index} // Assigning index as the key
    />
  </div>
  );
};
export default CategoryList;