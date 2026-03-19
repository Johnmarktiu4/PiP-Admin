"use client";
import React, { useState, useEffect } from 'react';
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";
import { FetchAPIData } from '@/lib/api';

export const MySales = () => {
    const [sales, setSales] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchSalesData = async () => {
            try {
                const req = new FetchAPIData();
                const userData = localStorage.getItem("user");
                const user = userData ? JSON.parse(userData) : null;
                const Username = user ? user.fld_Username : "";
                const response = await req.request("/sales/getMySales", { fld_Username: Username });
                if (response.status === "success") {
                    const transactions = response.data;
                    const totalSales = transactions
                        .filter((tx: any) => tx.fld_TransactionStatus === "Done")
                        .reduce((sum: number, tx: any) => sum + parseFloat(tx.fld_DiscountedAmount), 0);
                    setSales(totalSales);
                } else {
                     setSales(0);
                }
            } catch (error) {
                console.error("Error fetching sales data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSalesData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">

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
              {sales.toLocaleString(undefined, { style: 'currency', currency: 'PHP' })}
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
