import React from 'react';
import { useSelector } from 'react-redux';
import DownloadPDFButton from "../DownloadPdfButton";
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import {
    selectCategories,
  } from "../../selectors/selectors";

const PDFComponent = ({prop1}) => {
    const {transactions} = useSelector(state => state.transactions);
    const categories = useSelector(selectCategories);
    let data;
    if(prop1 === 'Transactions' || prop1 === 'summary') {
        data = transactions
    } else {
        data = categories
    }
    // console.log('Data:', categories);
    const generatePDF = () => {
        const pdf = new jsPDF();
    
        // Extract headers dynamically from the first object in data array
        const headers = Object.keys(data[0]);
        let filteredHeaders = [];

    
        if (prop1 === 'Transactions') {
            filteredHeaders = headers.filter(header => !["description", "createdAt", "updatedAt", "__v"].includes(header));
        } else if (prop1 === 'summary') {
	   const getSummary = ({expense, income}, transaction) => {
                transaction.type === "expense" ? expense += transaction.amount : income += transaction.amount;
                return {expense, income};
              };
              let {expense, income } = data.reduce(getSummary, {expense: 0, income: 0});
              const balance = income - expense
            filteredHeaders = ['expense', 'income', 'balance'];
            // Data adjustment for summary
            data = [{
                expense: `kshs ${expense}`,
                income: `kshs ${income}`,
                balance: `kshs ${balance}`
            }];
        } else {
            filteredHeaders = headers.filter(header => !["__v"].includes(header));
        }
    
        // Convert headers to an array of arrays for autoTable
        const header = [filteredHeaders.map(header => header.charAt(0).toUpperCase() + header.slice(1))];
    
        // Extract data from data array
        const pdfData = data.map(obj => Object.values(obj));
        
        // Set up autoTable options
        const tableOptions = {
            head: header,
            body: pdfData,
            startY: 35, // Adjust the startY value as needed
            didDrawPage: function (data) {
                // Header based on prop1
                let headerText = '';
                switch (prop1) {
                    case 'Transactions':
                        headerText = 'Transactions Report';
                        break;
                    case 'summary':
                        headerText = 'Summary Report';
                        break;
                    default:
                        headerText = 'Categories Report';
                        break;
                }

                const startX = data.settings.margin.left;
                const homeBudgetHeaderY = 15;
                const subsequentHeaderY = 15; // Adjust as needed
                pdf.setFontSize(24); // Increase font size
                pdf.setTextColor(40);
                pdf.text("HomeBudget", startX, homeBudgetHeaderY);

                // Original header
                pdf.setFontSize(20);
                pdf.setTextColor(40);
                pdf.text(headerText, startX, homeBudgetHeaderY + subsequentHeaderY);
            }
        };
    
        // Generate PDF with autoTable
        pdf.autoTable(tableOptions);
        
        const currentDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }); // Format as "date/month/year"
        const footerX = 10; // Left margin
        const footerY = pdf.internal.pageSize.height - 10; // Adjust as needed
        pdf.setFontSize(10);
        pdf.text(`Date of Publication: ${currentDate}`, footerX, footerY);
        
        
        // Save PDF
        pdf.save(`${prop1}.pdf`);
    }

    return (
        <DownloadPDFButton color="blue" onClick={generatePDF} />
    );
}

export default PDFComponent;