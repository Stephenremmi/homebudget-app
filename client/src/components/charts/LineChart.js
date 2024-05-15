import styled from "styled-components";
import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { selectExpenses, selectIncome } from "../../selectors/selectors";
import ReactEcharts from "echarts-for-react";
import { Radio, Button } from "antd";
import jsPDF from "jspdf";

const Wrap = styled.div`
  margin: 20px 0;
  display: flex;
  justify-content: space-evenly;
`;

const LineChart = () => {
  const expenses = useSelector(selectExpenses);
  const income = useSelector(selectIncome);
  const [currentCategory, setCurrentCategory] = useState("expense");
  const [showExpense, setShowExpense] = useState(true);
  const chartRef = useRef();

  const toggle = (event) => {
    setShowExpense(!showExpense);
    setCurrentCategory(event.target.value);
  };

  let expenseDates = expenses.map((o) => new Date(o.date).toDateString());
  let incomeDates = income.map((o) => new Date(o.date).toDateString());
  let expenseData = expenses.map((o) => o.amount);
  let incomeData = income.map((o) => o.amount);

  let option = {
    title: {
      text: showExpense ? "Expenses" : "Income",
      x: "center",
    },
    color: showExpense ? "#D53A35" : "#3398DB",
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    xAxis: [
      {
        type: "category",
        data: showExpense ? expenseDates : incomeDates,
        axisTick: {
          alignWithLabel: true,
        },
      },
    ],
    yAxis: [
      {
        type: "value",
      },
    ],
    series: [
      {
        name: showExpense ? "Expenses" : "Income",
        type: "bar",
        barWidth: "50%",
        data: showExpense ? expenseData : incomeData,
      },
    ],
  };

  const downloadChart = () => {
    const chartInstance = chartRef.current.getEchartsInstance();
  
    // Export the chart as a data URL
    const dataURL = chartInstance.getDataURL({
      pixelRatio: 2, // Adjusted scale factor for higher resolution
      backgroundColor: '#fff', // Set background color if needed
    });
  
    // Create a new jsPDF instance
    const pdf = new jsPDF("landscape", "px", "a4");
  
    // Calculate dimensions and margins for center alignment
    const imgWidth = pdf.internal.pageSize.getWidth() * 0.8; // Adjust width as needed
    const imgHeight = (imgWidth * chartInstance.getHeight()) / chartInstance.getWidth();
    const marginLeft = (pdf.internal.pageSize.getWidth() - imgWidth) / 2;
    const marginTop = (pdf.internal.pageSize.getHeight() - imgHeight) / 2;
  
    // Add the chart image to the PDF
    pdf.addImage(dataURL, "JPEG", marginLeft, marginTop, imgWidth, imgHeight);

    // Add header text
    pdf.setFontSize(24);
    pdf.text("Homebudget", marginLeft, marginTop - 30);
  
    // Add indication text for axes with adjusted font size and spacing
    pdf.setFontSize(12);
    pdf.text("Y-Axis: Amount", marginLeft, marginTop - 20);
    pdf.text("X-Axis: Date", marginLeft, marginTop - 10);
  
    // Add footer with the date of publication
    const currentDate = new Date().toLocaleDateString('en-GB'); // Format as "date/month/year"
    pdf.setFontSize(10);
    pdf.text(`Date of Publication: ${currentDate}`, marginLeft, marginTop + imgHeight + 10);

  
    // Save the PDF
    pdf.save("line_chart.pdf");
  };

  return (
    <div>
      <ReactEcharts ref={chartRef} option={option}></ReactEcharts>
      <Wrap>
        <Radio.Group
          value={currentCategory}
          buttonStyle="solid"
          onChange={toggle}
          size="large"
        >
          <Radio.Button value="expense">Show Expense</Radio.Button>
          <Radio.Button value="income">Show Income</Radio.Button>
        </Radio.Group>
        <Button type="primary" onClick={downloadChart}>Download PDF</Button>
      </Wrap>
    </div>
  );
};

export default LineChart;