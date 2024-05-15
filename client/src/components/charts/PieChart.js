import styled from "styled-components";
import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import {
  selectUniqueExpenses,
  selectUniqueIncome,
} from "../../selectors/selectors";
import { Radio, Button } from "antd";
import ReactEcharts from "echarts-for-react";
import jsPDF from "jspdf";

const Wrap = styled.div`
  margin: 20px 0;
  display: flex;
  justify-content: space-evenly;
`;

const PieChart = (props) => {
  const uniqueExpenses = useSelector(selectUniqueExpenses);
  const uniqueIncome = useSelector(selectUniqueIncome);
  const chartRef = useRef();  

  const [currentCategory, setCurrentCategory] = useState("expense");
  const [showExpense, setShowExpense] = useState(true);

  const toggle = (event) => {
    setShowExpense(!showExpense);
    setCurrentCategory(event.target.value);
  };

  let state = {
    data: showExpense
      ? uniqueExpenses.map((o) => {
          return { value: o.amount, name: o.category };
        })
      : uniqueIncome.map((o) => {
          return { value: o.amount, name: o.category };
        }),
    labels: showExpense
      ? uniqueExpenses.map((e) => e.category)
      : uniqueIncome.map((e) => e.category),
  };

  let option = {
    title: {
      text: showExpense ? "Expenses" : "Income",
      x: "center",
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)",
    },
    legend: {
      orient: "horizontal",
      bottom: 5,
      data: state.labels,
    },
    series: [
      {
        name: "Pie Chart",
        type: "pie",
        radius: "55%",
        center: ["50%", "60%"],
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        labelLine: {
          show: true,
        },
        data: state.data,
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

  
    // Add footer with the date of publication
    const currentDate = new Date().toLocaleDateString('en-GB'); // Format as "date/month/year"
    pdf.setFontSize(10);
    pdf.text(`Date of Publication: ${currentDate}`, marginLeft, marginTop + imgHeight + 10);
  
    // Save the PDF
    pdf.save("pie_chart.pdf");
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

export default PieChart;
