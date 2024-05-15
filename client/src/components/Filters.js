import { FilterOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Modal, message } from "antd";
import React, { useState } from "react";
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import {
  selectFilterDates,
  selectIsMobileScreen,
} from "../selectors/selectors";
import moment from "moment";
import {
  setTransactions,
} from "../actions/actions";
import useAuth from "../hooks/useAuth";

const Filters = ({ setTransactionsData = () => { } }) => {
  const [visible, setVisible] = useState(false);
  const filterDates = useSelector(selectFilterDates);
  const [startDate, setStartDate] = useState(filterDates.startDate);
  const [endDate, setEndDate] = useState(filterDates.endDate);
  const dispatch = useDispatch();
  // const email = useSelector(selectEmail);
  const isMobileScreen = useSelector(selectIsMobileScreen);

  const layout = !isMobileScreen ? "inline" : "";

  const { token } = useAuth();
  const updateFilters = async (event) => {
    event.preventDefault();

    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);

    try {
      const response = await axios.post("/api/get-transactions", {
        startDate,
        endDate
      },
        {
          headers: {
            "x-access-token": token,
          }
        });


      const { transactions } = response.data; // Destructuring
      // dispatch(setName(name));
      // dispatch(setEmail(email))  ;
      dispatch(setTransactions(transactions));
      setTransactionsData(transactions); // Assuming consistent data structure

    } catch (error) {
      console.error(error);
      console.log(error)
      message.error(error.response?.data?.error || "Error fetching transactions. Please try again."); // Consistent error message
    }
  };

  const formDom = () => {
    const [form] = Form.useForm();

    return (
      <Form
        name="filters"
        form={form}
        layout={layout}
        initialValues={{
          startDate: moment(startDate),
          endDate: moment(endDate),
        }}
      >
        <Form.Item
          label="Start Date"
          name="startDate"
          rules={[
            {
              required: true,
              message: "Please select Start Date!",
            },
          ]}
        >
          <DatePicker
            format={"DD-MM-YYYY"}
            onChange={(date, dateString) => {
              date && setStartDate(date._d);
            }}
          />
        </Form.Item>
        <Form.Item
          label="End Date"
          name="endDate"
          dependencies={["starDate"]}
          rules={[
            {
              required: true,
              message: "Please select End Date!",
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue("startDate")._d < value._d) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  "End Date cannot be lesser than start date"
                );
              },
            }),
          ]}
        >
          <DatePicker
            format={"DD-MM-YYYY"}
            onChange={(date, dateString) => {
              date && setEndDate(date._d);
            }}
          />
        </Form.Item>
        {!isMobileScreen && (
          <Form.Item shouldUpdate={true}>
            {() => (
              <Button
                type="primary"
                htmlType="submit"
                disabled={
                  !form.isFieldsTouched(true) ||
                  form.getFieldsError().filter(({ errors }) => errors.length)
                    .length
                }
                onClick={updateFilters}
              >
                Apply Filter
                <FilterOutlined />
              </Button>
            )}
          </Form.Item>
        )}
      </Form>
    );
  };
  return (
    <div style={{ display: "flex", marginBottom: "10px" }}>
      {isMobileScreen ? (
        <Modal
          title="Apply Filters"
          visible={visible}
          onOk={(e) => {
            updateFilters(e);
            setVisible(false);
          }}
          onCancel={() => {
            setVisible(false);
          }}
        >
          {formDom()}
        </Modal>
      ) : (
        formDom()
      )}
      {isMobileScreen && (
        <Button
          type="primary"
          onClick={(event) => {
            setVisible(true);
            updateFilters(event);
          }}
        >
          Apply Filter
          <FilterOutlined />
        </Button>
      )}
    </div>
  );
};
export default Filters;
