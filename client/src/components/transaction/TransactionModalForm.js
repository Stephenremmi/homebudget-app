import React from 'react';
import {DatePicker, Form, Input, InputNumber, Modal, Select} from 'antd';
import moment from "moment";
import {useSelector} from "react-redux";
import {selectCategories} from "../../selectors/selectors";

const {Option} = Select;

const TransactionModalForm = ({initialValues, visible, onCreate, onCancel}) => {
  const [form] = Form.useForm();
  const categories = useSelector(selectCategories);
  const types = ['income', 'expense'];
  const typeCategories = {
    income: categories.filter(c => c.type === "income").map(c => c.name),
    expense: categories.filter(c => c.type === "expense").map(c => c.name)
  };
  return (
    <Modal
      visible={visible}
      title={"Update"}
      okText={"Update"}
      cancelText="Cancel"
      onCancel={()=>{
        onCancel();
        form.resetFields();
      }}
      onOk={() => {
        form
          .validateFields()
          .then(values => {
            form.resetFields();
            onCreate(values);
          })
          .catch(info => {
            console.log('Validate Failed:', info);
          });
      }}>
      <Form
        form={form}
        layout={"vertical"}
        name="add-transaction"
        initialValues={{
          amount: initialValues.amount,
          type: initialValues.type,
          date: moment(initialValues.date),
          incomeCategory: initialValues.incomeCategory || typeCategories["income"][0],
          expenseCategory: initialValues.expenseCategory || typeCategories["expense"][0],
          description: initialValues.description
        }}
      >
        <Form.Item
          label="Amount"
          name="amount"
          rules={[
            {
              required: true,
              message: 'Please enter amount!',
            },
          ]}
        >
          <InputNumber min={1}/>
        </Form.Item>

        <Form.Item
          label="Date"
          name="date"
          rules={[
            {
              required: true,
              message: 'Please select date!',
            },
          ]}>
          <DatePicker/>
        </Form.Item>

        <Form.Item
          label="Type"
          name="type"
          value={initialValues.type}
          rules={[
            {
              required: true,
              message: 'Please select type!',
            },
          ]}
        >
          <Select>
            {types.map(type => (
              <Option key={type}>{type}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}>
          {({getFieldValue}) => {
            return getFieldValue('type') === 'income' ? (
              <Form.Item
                name="incomeCategory"
                label="Category"
                rules={[{required: true}]}>
                <Select>
                  {typeCategories.income.map(c => (
                    <Option key={c}>{c}</Option>
                  ))}
                </Select>
              </Form.Item>
            ) : <Form.Item
              name="expenseCategory"
              label="Category"
              rules={[{required: true}]}>
              <Select>
                {typeCategories.expense.map(c => (
                  <Option key={c}>{c}</Option>
                ))}
              </Select>
            </Form.Item>;
          }}
        </Form.Item>
        <Form.Item
          label="Description"
          name="description">
          <Input/>
        </Form.Item>
      </Form>
    </Modal>
  )
};
export default TransactionModalForm;