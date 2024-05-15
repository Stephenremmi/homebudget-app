import React, { useEffect, useState, useCallback } from "react";
import { setCategories } from "../../actions/actions";
import { useDispatch } from "react-redux";
import { Button, Form, Input, Modal, Select, message } from "antd";
import FloatPlusButton from "../FloatPlusButton";
import axios from 'axios';
import PDFComponent from "../transaction/Pdf"
import useAuth from "../../hooks/useAuth";
const { Option } = Select;

const CategoryPopup = () => {
  // const [categories, setCategoriesData] = useState([]);
  const [category, setCategory] = useState("");
  const [type, setType] = useState("income");
  const dispatch = useDispatch();
  const types = ["income", "expense"];
  const [showModal, toggleModalShow] = useState(false);
  const { token } = useAuth();

  const updateCategories = useCallback(async () => {
    try {
      const response = await axios.post('/api/get-categories', {
        type,
        name: category,
      }, {
        headers: {
          "x-access-token": token,
        }
      });

      const { categories } = response.data;
      dispatch(setCategories(categories));
    } catch (error) {
      console.error(error);
      message.error(error.message || 'Error fetching categories. Please try again.');
    }
}, [type, category, token, dispatch]);

  useEffect(() => {
    updateCategories();
  }, [updateCategories]);

  const addCategory = async (event) => {
    event.preventDefault();
    toggleModalShow(false); // Close modal first for a smoother experience

    try {
        const response = await axios.post('/api/add-category', {
            type,
            name: category,
        }, 
        {
            headers: {
                "x-access-token": token,
            }
        });

        if (response.status !== 200) {
            throw new Error(response.data.error || 'Error adding category. Please try again.'); // More specific error message
        }
        console.log(response.data);
        dispatch(setCategories(response.data));
        message.success('Category added successfully!');
        // setCategoriesData(response.data.categories);
        // console.log(response.data.categories);

        updateCategories();
        // Ensure categoriesList is an array before download
    } catch (error) {
        console.error(error);
        message.error(error.message || 'Error adding category. Please try again.'); // Consistent error message
    }
};

  return (
    <div>
      <PDFComponent prop1={'categories'} /> {/* If you're not using 'categories', you can remove this */}
      <FloatPlusButton
        onclick={() => {
          toggleModalShow(true);
        }}
      />
      <Modal
        title="Add Category"
        visible={showModal}
        onCancel={() => {
          toggleModalShow(false);
        }}
        footer={[
          <Button key="submit" type="primary" onClick={addCategory}>
            Add Category
          </Button>,
        ]}
      >
        <Form
          name="add-category"
          initialValues={{
            type: type,
          }}
        >
          <Form.Item
            label="Type"
            name="type"
            rules={[
              {
                required: true,
                message: "Please select type!",
              },
            ]}
          >
            <Select
              style={{ width: 120 }}
              onChange={(value) => {
                setType(value);
              }}
            >
              {types.map((t) => (
                <Option key={t}>{t}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Category"
            name="category"
            rules={[
              {
                required: true,
                message: "Please enter category name!",
              },
            ]}
          >
            <Input
              placeholder={"New Category Name"}
              onChange={(event) => {
                setCategory(event.target.value);
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};


export default CategoryPopup;
