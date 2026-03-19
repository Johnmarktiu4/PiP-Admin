"use client";
import React, { useEffect, useState } from "react";
import { FetchAPIData } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Image from "next/image";

// Define the TypeScript interface for the table rows
interface Product {
  id: number; // Unique identifier for each product
  name: string; // Product name
  variants: string; // Number of variants (e.g., "1 Variant", "2 Variants")
  category: string; // Category of the product
  price: string; // Price of the product (as a string with currency symbol)
  // status: string; // Status of the product
  image: string; // URL or path to the product image
  status: "Delivered" | "Pending" | "Canceled"; // Status of the product
}

interface Orders {
  fld_Id: number;
  fld_ProductId: number;
  fld_Price: string;
  fld_Qty: number;
  fld_ProductName: string;
  fld_Image: string;
}

interface OrdersTableProps {
  // You can define props here if needed
}

const OrderTable: React.FC<OrdersTableProps> = () => {
  const [tableData, setTableData] = useState<Orders[]>([]);

  const fetchTableData = async () => {
      try {
        const req = new FetchAPIData();
        const response = await req.requestWOParam("/order/recentOrder");
        if (response.status === "success") {
          setTableData(response.data);    
          const total = response.data.reduce((sum: number, order: Orders) => {
            return sum + parseFloat(order.fld_Price) * order.fld_Qty;
          }, 0);
        } else {
          console.error("Failed to fetch account data:", response.message);
        }
      } catch (error) {
        console.error("Error fetching account data:", error);
      }
    };
  

    useEffect(() => {
      fetchTableData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

  return (
            <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-10 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Order Item
                  </TableCell>
                  <TableCell isHeader className="px-10 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Price
                  </TableCell>
                  <TableCell isHeader className="px-10 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Quantity
                  </TableCell>
                  <TableCell isHeader className="px-10 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Sub Total
                  </TableCell>
                </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {tableData.map((orders) => (
                <TableRow key={orders.fld_Id}>
                    <TableCell className="px-9 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 overflow-hidden rounded-full">
                        <Image width={40} height={40} src= {'data:image/jpeg;base64,' + orders.fld_Image} alt={orders.fld_ProductName} />
                        </div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {orders.fld_ProductName}
                        </span>
                    </div>
                    </TableCell>
                    <TableCell className="px-8 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        ₱{orders.fld_Price}
                    </TableCell>
                    <TableCell className="px-8 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {orders.fld_Qty}
                    </TableCell>
                    <TableCell className="px-8 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        ₱{(parseFloat(orders.fld_Price) * orders.fld_Qty).toFixed(2)}
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
  );
};

export default function RecentOrders() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent Orders
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            <svg
              className="stroke-current fill-white dark:fill-gray-800"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.29004 5.90393H17.7067"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.7075 14.0961H2.29085"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
              <path
                d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
            </svg>
            Filter
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            See all
          </button>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <OrderTable/>
      </div>
    </div>
  );
}
