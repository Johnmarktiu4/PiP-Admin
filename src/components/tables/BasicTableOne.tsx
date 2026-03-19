"use client";
import React, { useEffect, useState, useCallback } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { FetchAPIData } from "@/lib/api";
import { ConvertImage} from "@/lib/convertimage";
import { BoxIcon } from "@/icons";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Select from '@/components/form/Select';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import Badge from "../ui/badge/Badge";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import Image from "next/image";

interface Transaction {
  fld_Id: number;
  fld_TransactionNumber: string;
  fld_DateCreated: string;
  fld_TotalAmount: number;
  fld_Discount: number;
  fld_Charge: number;
  fld_DiscountedAmount: number;
  fld_AmountPaid: number;
  fld_DiscountType: string;
  fld_PaymentMethod: string;
  fld_TransactionType: string;
  fld_TransactionCheckNumber: string;
  fld_Change: number;
  fld_TransactionStatus: string;
  fld_Username: string;
}

interface TransactionTableProps {
  onEdit: (transaction: Transaction) => void;
  refreshKey: number;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ onEdit, refreshKey }) => {
    const [tableData, setTableData] = useState<Transaction[]>([]);
    const [page, setPage] = useState(1);
    const rowsPerPage = 10;

    const fetchTableData = async () => {
      try {
        const req = new FetchAPIData();
        const response = await req.requestWOParam("/transaction/getTransactionList");
        if (response.status === "success") {
          setTableData(response.data);
        } else {
          console.error("Failed to fetch account data:", response.message);
        }
      } catch (error) {
        console.error("Error fetching account data:", error);
      }
    };
    
    useEffect(() => {
      fetchTableData();
      setPage(1);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshKey]);

    const paginatedData = tableData.slice((page - 1) * rowsPerPage, page * rowsPerPage);
    const totalPages = Math.ceil(tableData.length / rowsPerPage);

    return(
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]"> 
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Transaction Number</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Transaction Type</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Date Created</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Total Amount</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Discount Type</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Discount</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Payment Method</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Charge</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Discounted Amount</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Amount Paid</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Change</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Transaction Check Number</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Transaction Status</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Processed By</TableCell>
                  <TableCell isHeader className="px-15 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Action</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {paginatedData.map((transaction) => (
                  <TableRow key={transaction.fld_Id}>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{transaction.fld_TransactionNumber}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{transaction.fld_TransactionType}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{transaction.fld_DateCreated}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">₱{transaction.fld_TotalAmount}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{transaction.fld_DiscountType}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">₱{transaction.fld_Discount}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{transaction.fld_PaymentMethod}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">₱{transaction.fld_Charge}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">₱{transaction.fld_DiscountedAmount}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">₱{transaction.fld_AmountPaid}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">₱{transaction.fld_Change}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{transaction.fld_TransactionCheckNumber}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <Badge
                        size="sm"
                        color={
                          transaction.fld_TransactionStatus === "Done"
                            ? "success"
                            : transaction.fld_TransactionStatus === "Ongoing"
                            ? "warning"
                            : "error"
                          }
                        >
                        {transaction.fld_TransactionStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{transaction.fld_Username}</TableCell>
                    <TableCell className="px-13 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="flex justify-center gap-2">
                        {transaction.fld_TransactionStatus === "Pending" && (
                          <>
                          <button className="bg-red-500 text-white rounded px-4 py-2 hover:underline" onClick={async () => {
                            const req = new FetchAPIData();
                            const transactionCancel = {
                              fld_Id: transaction.fld_Id,
                              fld_TransactionStatus: "Cancelled"
                            };
                            const response = await req.request("/transaction/setStatus", transactionCancel);
                            alert(response.message);
                            fetchTableData();
                          }}>
                          Cancel
                          </button>
                          <button className="bg-green-500 text-white rounded px-4 py-2 hover:underline" onClick={async () => {
                            const req = new FetchAPIData();
                            const transactionDone = {
                              fld_Id: transaction.fld_Id,
                              fld_TransactionStatus: "Done"
                            };
                            const response = await req.request("/transaction/setStatus", transactionDone);
                            alert(response.message);
                            fetchTableData();
                          }}>
                            Done
                          </button>
                          </>
                        )}
                      </div>
                    </TableCell>
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
  );
};

export default function BasicTableOne() {
  return (
    <div>
      <ComponentCard title="Transaction Table">
        <div className="flex items-right gap-5">
          {/* <Button size="small" variant="outlined" startIcon={<BoxIcon />} onClick={() => console.log("Refresh")}>
            Add Account
          </Button> */}
        </div>
        <TransactionTable onEdit={(transaction) => console.log("Edit", transaction)} refreshKey={0} />
      </ComponentCard>
    </div>
  );
}
