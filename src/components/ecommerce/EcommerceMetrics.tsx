"use client";
import React, { useState, useEffect } from 'react';
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";
import { FetchAPIData } from '@/lib/api';


export const EcommerceMetrics = () => {
  const [customer, setCustomer] = useState<number>(0);
  const [orders, setOrders] = useState<number>(0);
  
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const req = new FetchAPIData();
        const response = await req.requestWOParam("/transaction/getTransactionList");
        if (response.status === "success") { 
          const transactions = response.data;

          // Count transactions that are not cancelled
          const activeCustomers = transactions.filter(
            (tx: any) => tx.fld_TransactionStatus !== "Cancelled"
          ).length;

          // Sum of discounted amounts for transactions with status "Done"
          const totalOrders = transactions
            .filter((tx: any) => tx.fld_TransactionStatus === "Done")
            .reduce((sum: number, tx: any) => sum + parseFloat(tx.fld_DiscountedAmount), 0);

          setCustomer(activeCustomers);
          setOrders(totalOrders);
        } else {
          console.error("Failed to fetch account data:", response.message);
        }
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    fetchMetrics();
  }, []);
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Customers
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {customer}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Sales
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {orders}
            </h4>
          </div>

          <Badge color="success">
            <ArrowUpIcon />
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
};
