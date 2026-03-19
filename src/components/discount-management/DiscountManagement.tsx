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

interface Discount {
  fld_Id: number;
  fld_DiscountName: string;
  fld_Percentage: number;
  fld_Status: string;
}

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

interface DiscountTableProps {
  onEdit: (discount: Discount) => void;
  refreshKey: number;
}

const DiscountTable: React.FC<DiscountTableProps> = ({ onEdit, refreshKey }) => {
  const [tableData, setTableData] = useState<Discount[]>([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const fetchTableData = async () => {
    try {
      const req = new FetchAPIData();
      const response = await req.requestWOParam("/discount");
      if (response.status === "success") {
        setTableData(response.data);
      } else {
        console.error("Failed to fetch discount data:", response.message);
      }
    } catch (error) {
      console.error("Error fetching discount data:", error);
    }
  };

  useEffect(() => {
    fetchTableData();
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  const paginatedData = tableData.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const totalPages = Math.ceil(tableData.length / rowsPerPage);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Discount ID</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Discount Name</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Percentage</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Status</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Action</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {paginatedData.map((discount) => (
                <TableRow key={discount.fld_Id}>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{discount.fld_Id}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{discount.fld_DiscountName}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{discount.fld_Percentage}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        discount.fld_Status === "Active"
                          ? "success"
                          : discount.fld_Status === "Inactive"
                          ? "warning"
                          : "error"
                      }
                    >
                      {discount.fld_Status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <button className="text-blue-500 hover:underline" onClick={() => onEdit(discount)}>edit</button>
                    <span>|</span>
                    <button className="text-blue-500 hover:underline" onClick={async () => {
                      const req = new FetchAPIData();
                      const response = await req.request("/discount/setStatus", { fld_Id: discount.fld_Id });
                      alert(response.message);
                      fetchTableData();
                    }}>
                      {discount.fld_Status === "Active" ? "Inactive" : "Active"}
                    </button>
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

export default function DiscountManagement() {
  const [open, setOpen] = useState(false);
  const [Id, setId] = useState(0);
  const [discountName, setDiscountName] = useState("");
  const [percentage, setPercentage] = useState(0);
  const [discountStatus, setStatus] = useState("Active");
  const [refreshKey, setRefreshKey] = useState(0);
  const [manage, setManage] = useState("Add Discount");

  const options = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const triggerRefresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  const handleEdit = (discount: Discount) => {
    setId(discount.fld_Id);
    setDiscountName(discount.fld_DiscountName);
    setPercentage(discount.fld_Percentage);
    setStatus(discount.fld_Status);
    setManage("Edit Discount");
    handleOpen();
  };

  return (
    <div>
      <div className="space-y-6">
        <ComponentCard title="Product Table">
          <div className="flex items-right gap-5">
            <Button size="small" variant="outlined" startIcon={<BoxIcon />} onClick={() =>
                 { 
                    setManage("Add Discount");
                    setId(0);
                    setDiscountName("");
                    setPercentage(0);
                    setStatus("Active");
                    handleOpen();
                 }
                 }>
              Add Discount
            </Button>
          </div>
          <DiscountTable onEdit={handleEdit} refreshKey={refreshKey} />
          <Modal open={open} onClose={handleClose}>
            <Box sx={modalStyle}>
              <center>
              <h2 className="text-lg font-semibold">{manage}</h2>
              </center>
                <form onSubmit={async (e) => {
                    e.preventDefault();
                    const req = new FetchAPIData();
                    if (manage === "Edit Discount") {
                        const newDiscount = {
                            fld_Id: Id,
                            fld_DiscountName: discountName,
                            fld_Percentage: percentage,
                            fld_Status: discountStatus,
                        };
                        newDiscount.fld_Id = Id;
                        console.log(newDiscount);
                        const response = await req.request("/discount/edit", newDiscount);
                        if (response.status === "success") {
                            alert(response.message);
                        } else {
                            alert(response.message);
                        }
                    }
                    else{
                        const newDiscount = {
                            fld_DiscountName: discountName,
                            fld_Percentage: percentage,
                            fld_Status: discountStatus,
                        };
                        const response = await req.request("/discount/add", newDiscount);
                        if (response.status === "success") {
                            alert(response.message);
                        }
                        else {
                            alert(response.message);
                        }
                    }
                    triggerRefresh();
                    handleClose();
                }}>
                    <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="discountName">
                        Discount Name
                    </label>
                    <Input
                        type="text"
                        id="discountName"
                        name="discountName"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter Discount Name"
                        value={discountName}
                        onChange ={(e) => setDiscountName(e.target.value)}
                    />
                    </div>
                    <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="percentage"
                    >
                        Discount Percentage
                    </label>
                    <Input
                        type="number"
                        id="percentage"
                        name="percentage"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter Discount Percentage"
                        value={percentage}
                        onChange={(e) => setPercentage(Number(e.target.value))}
                    />
                    </div>
                    <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="status"
                    >
                        Status
                    </label>
                    <Select options={options}
                        id="status"
                        name="status"
                        placeholder="Select Status"
                        defaultValue={discountStatus}
                        onChange={(value) => setStatus(value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    </div>
                    <div className="flex items-center justify-between">
                    <Button variant="contained" color="primary" type="submit">
                        Save
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={handleClose} className="ml-2">
                        Cancel
                    </Button>
                    </div>
                </form>
                </Box>
            </Modal>
        </ComponentCard>
      </div>
    </div>
  );
}