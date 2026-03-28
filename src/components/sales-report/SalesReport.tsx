
"use client";
import React, { useState, useEffect, useRef } from "react";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FetchAPIData } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Button from "@mui/material/Button";
import Select from "@/components/form/Select";
import Label from "../form/Label";
import ComponentCard from "../common/ComponentCard";
import Modal from "@mui/material/Modal";

interface ReportTransactionSale {
    fld_TransactionNumber: string;
    fld_DateCreated: string;
    fld_TotalAmount: number;
    fld_Discount: number;
    fld_AmountPaid: number;
    fld_Change: number;
}

interface ReportProductSale {
    fld_ProductId: string;
    fld_Price: number;
    fld_Qty: number;
    fld_TransactionId: string;
}

interface ProductId {
    fld_ProductId: number;
}

const SaleTable: React.FC<{ refereshKey: number }> = ({ refereshKey }) => {
  const [reportType, setReportType] = useState<"transaction" | "product">("transaction");
  const [reportTransactionSales, setReportTransactionSales] = useState<ReportTransactionSale[]>([]);
  const [reportProductSales, setReportProductSales] = useState<ReportProductSale[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState(1);
  const [filterTo, setFilterTo] = useState<string>("2025-09-08");
  const [filterFrom, setFilterFrom] = useState<string>("2025-08-01");
  const [filterProduct, setFilterProduct] = useState<string>("");
  const [productId, setProductId] = useState<ProductId[]>([]);
  const rowsPerPage = 10;

  const tableRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    const element = tableRef.current;
    if (!element) return;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("landscape", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`SalesReport_${reportType}.pdf`);
  };

  const fetchReport = async () => {
    try {
      const req = new FetchAPIData();
      const filter = {
        to: filterTo,
        from: filterFrom
      };
      console.log("Fetching reports with filter:", filter);
      // You can modify the API endpoints as needed
      const transactionRes = await req.request("/report/getTransactionReport", filter);
      if (filterProduct !== "All Products" && filterProduct !== "") {
        if (reportType === "product" && filterProduct.trim() !== "") {
          Object.assign(filter, { product: filterProduct.trim() });
        }
      }
      const productRes = await req.request("/report/getProductReport", filter);
      const productIdRes = await req.requestWOParam("/report/getUniqueProductId");
      if (transactionRes.status === "success") setReportTransactionSales(transactionRes.data);
      if (productRes.status === "success") setReportProductSales(productRes.data);
      if (productIdRes.status === "success") setProductId(productIdRes.data);
      console.log("ProductId", productIdRes.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };
  

  useEffect(() => {
    fetchReport().then(() => setLoading(false));
    setPage(1);
  }, [refereshKey]);

  const paginatedTransactionData = reportTransactionSales.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const paginatedProductData = reportProductSales.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const totalPages = reportType === "transaction"
    ? Math.ceil(reportTransactionSales.length / rowsPerPage)
    : Math.ceil(reportProductSales.length / rowsPerPage);

  const productOptions = [
    ...productId.map((product) => ({
      label: product.fld_ProductId.toString(),
      value: product.fld_ProductId.toString()
    })),
    { label: "All Products", value: "All Products" }
  ];

  return (
    <div className="report-container">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="movementStatus">
        Sales Report Type
      </label>
      <Select
        id="reportType"
        options={[
          { label: "Per Transaction", value: "transaction" },
          { label: "Per Package", value: "product" }
        ]}
        defaultValue="transaction"
        value={reportType}
        onChange={(value: string) => setReportType(value as "transaction" | "product")}
      />      
      <div className="flex gap-4 mb-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="filterFrom">From Date</label>
          <input
            type="date"
            id="filterFrom"
            value={filterFrom}
            onChange={(e) => setFilterFrom(e.target.value)}
            pattern="\d{4}-\d{2}-\d{2}"
            className="border rounded px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="filterTo">To Date</label>
          <input
            type="date"
            id="filterTo"
            value={filterTo}
            onChange={(e) => setFilterTo(e.target.value)}
            pattern="\d{4}-\d{2}-\d{2}"
            className="border rounded px-3 py-2 text-sm"
          />
        </div>
        {reportType === "product" ? (
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="filterProduct">Package</label>
            <Select
              id="filterProduct"
              options={productOptions}
              placeholder="Select Package ID"
              value={filterProduct}
              onChange={(value: string) => setFilterProduct(value)}
            />
          </div>
        ) : null}
      </div>

      <div className="mt-2 mb-4">
        <button
          onClick={() => fetchReport()}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Apply Filter
        </button>
        &nbsp;   
        <button
          onClick={() => handleDownloadPDF()}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Download PDF
        </button>
      </div>
      <div ref={tableRef} className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]"> 
        <div className="p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              <center>
                <img
                  width={231}
                  height={48}
                  // src="./images/logo/auth-logo.svg"
                  src="./images/logo/test.svg"
                alt="Logo"
              />
              </center>
              {reportType === "transaction" ? "Transaction Sales Report" : "Product Sales Report"}
            </h3>
            <div className="flex items-center gap-2">
              <Badge color="success">
                {reportType === "transaction"
                  ? reportTransactionSales.length
                  : reportProductSales.length}{" "}
                Records
              </Badge>
            </div>
          </div>
        </div>
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  {reportType === "transaction" ? (
                    <>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">Transaction Number</TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">Date Created</TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">Total Amount</TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">Discount</TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">Amount Paid</TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">Change</TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">Transaction ID</TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">Package ID</TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">Price</TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">Quantity</TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">Total</TableCell>
                    </>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {reportType === "transaction"
                  ? paginatedTransactionData.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">{item.fld_TransactionNumber}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">{item.fld_DateCreated}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">₱{item.fld_TotalAmount}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">₱{item.fld_Discount}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">₱{item.fld_AmountPaid}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">₱{item.fld_Change}</TableCell>
                      </TableRow>
                    ))
                  : paginatedProductData.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">{item.fld_TransactionId}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">{item.fld_ProductId}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">₱{item.fld_Price}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">{item.fld_Qty}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">₱{item.fld_Price * item.fld_Qty}</TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>

      <div className="flex justify-center items-center mt-4 gap-2">
          <Button
            variant="outlined"
            size="small"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <span>
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outlined"
            size="small"
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
          <br />
          <br />
       </div>
    </div>
    </div>
    </div>
    </div>
  );
};

export default function SaleTables() {
  return (
    <div>
      <ComponentCard title="Sale Table">
        <SaleTable refereshKey={0} />
      </ComponentCard>
    </div>
  );
}
