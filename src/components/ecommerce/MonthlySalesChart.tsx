"use client";
import { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { FetchAPIData } from "@/lib/api";
import { MoreDotIcon } from "@/icons";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Dropdown } from "../ui/dropdown/Dropdown";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function MonthlyTarget() {
  const [monthlySales, setMonthlySales] = useState<number[]>([]);
  const [monthLabels, setMonthLabels] = useState<string[]>([]);

  useEffect(() => {
    const fetchMonthlySales = async () => {
      const req = new FetchAPIData();
      const res = await req.requestWOParam("/transaction/getTransactionList");
      if (res.status === "success") {
        const data = res.data;
        const monthlyTotals: { [key: string]: number } = {};

        data.forEach((item: any) => {
          if (item.fld_TransactionStatus === "Done") {
            const date = new Date(item.fld_DateCreated);
            console.log(date);
            const month = date.toLocaleString("default", { month: "short", year: "numeric" });
            monthlyTotals[month] = (monthlyTotals[month] || 0) + parseFloat(item.fld_DiscountedAmount);
          }
        });

        const sortedMonths = Object.keys(monthlyTotals).sort(
          (a, b) => new Date(a).getTime() - new Date(b).getTime()
        );
        setMonthLabels(sortedMonths);
        setMonthlySales(sortedMonths.map(month => monthlyTotals[month]));
      }
    };

    fetchMonthlySales();
  }, []);

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 180,
    },
    xaxis: {
      categories: monthLabels,
    },
  };

  const series = [
    {
      name: "Sales",
      data: monthlySales,
    },
  ];
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Monthly Sales
        </h3>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <ReactApexChart options={options} series={series} type="bar" height={180} />
        </div>
      </div>
    </div>
  );
}
