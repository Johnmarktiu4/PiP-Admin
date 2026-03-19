"use client";
import React, { useEffect, useState, useCallback } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { FetchAPIData } from "@/lib/api";
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

interface Category {
  fld_CategoryId: number;
  fld_CategoryCode: string;
  fld_CategoryName: string;
  fld_CategoryDetails: string;
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

interface CategoryTableProps {
  onEdit: (category: Category) => void;
  refreshKey: number;
}

const CategoryTable: React.FC<CategoryTableProps> = ({ onEdit, refreshKey }) => {
  const [tableData, setTableData] = useState<Category[]>([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const fetchTableData = async () => {
    try {
      const req = new FetchAPIData();
      const response = await req.requestWOParam("/category");
      if (response.status === "success") {
        setTableData(response.data);
      } else {
        console.error("Failed to fetch category data:", response.message);
      }
    } catch (error) {
      console.error("Error fetching category data:", error);
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
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Category ID</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Category Code</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Category Name</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Category Details</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Status</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Action</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {paginatedData.map((category) => (
                <TableRow key={category.fld_CategoryId}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {category.fld_CategoryId}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{category.fld_CategoryCode}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{category.fld_CategoryName}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{category.fld_CategoryDetails}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        category.fld_Status === "Active"
                          ? "success"
                          : category.fld_Status === "Inactive"
                          ? "warning"
                          : "error"
                      }
                    >
                      {category.fld_Status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <button className="text-blue-500 hover:underline" onClick={() => onEdit(category)}>edit</button>
                    <span>|</span>
                    <button className="text-blue-500 hover:underline" onClick={async () => {
                      const req = new FetchAPIData();
                      const response = await req.request("/category/setStatus", { fld_CategoryId: category.fld_CategoryId });
                      alert(response.message);
                      fetchTableData();
                    }}>
                      {category.fld_Status === "Active" ? "Inactive" : "Active"}
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

export default function CategoryManagement() {
  const [open, setOpen] = useState(false);
  const [categoryId, setCategoryId] = useState(0);
  const [categoryCode, setCategoryCode] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categoryDetails, setCategoryDetails] = useState("");
  const [categoryStatus, setStatus] = useState("Active");
  const [refreshKey, setRefreshKey] = useState(0);
  const [manage, setManage] = useState("Add Category");

  const options = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const triggerRefresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  const handleEdit = (category: Category) => {
    setCategoryId(category.fld_CategoryId);
    setCategoryCode(category.fld_CategoryCode);
    setCategoryName(category.fld_CategoryName);
    setCategoryDetails(category.fld_CategoryDetails);
    setStatus(category.fld_Status);
    setManage("Edit Category");
    handleOpen();
  };

  return (
    <div>
      <div className="space-y-6">
        <ComponentCard title="Category Table">
          <div className="flex items-right gap-5">
            <Button size="small" variant="outlined" startIcon={<BoxIcon />} onClick={() =>
                 { 
                    setManage("Add Category"); 
                    setCategoryId(0);
                    setCategoryCode("");
                    setCategoryName("");
                    setCategoryDetails("");
                    setStatus("Active");
                    handleOpen(); 
                 }
                 }>
              Add Category
            </Button>
          </div>
          <CategoryTable onEdit={handleEdit} refreshKey={refreshKey} />
          <Modal open={open} onClose={handleClose}>
            <Box sx={modalStyle}>
              <center>
              <h2 className="text-lg font-semibold">{manage}</h2>
              </center>
                <form onSubmit={async (e) => {
                    e.preventDefault();
                    const req = new FetchAPIData();
                    if (manage === "Edit Category") {
                        const newCategory = {
                            fld_CategoryId: categoryId,
                            fld_CategoryCode: categoryCode,
                            fld_CategoryName: categoryName,
                            fld_CategoryDetails: categoryDetails,
                            fld_Status: categoryStatus,
                        };
                        newCategory.fld_CategoryCode = categoryCode;
                        const response = await req.request("/category/edit", newCategory);
                        if (response.status === "success") {
                            alert(response.message);
                        } else {
                            alert(response.message);
                        }
                    }
                    else{
                        const newCategory = {
                            fld_CategoryId: categoryId,
                            fld_CategoryCode: categoryCode,
                            fld_CategoryName: categoryName,
                            fld_CategoryDetails: categoryDetails,
                            fld_Status: categoryStatus,
                        };
                        const response = await req.request("/category/add", newCategory);
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
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="categoryCode">
                        Category Code
                    </label>
                    <Input
                        type="text"
                        id="categoryCode"
                        name="categoryCode"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter Category Code"
                        value={categoryCode}
                        onChange ={(e) => setCategoryCode(e.target.value)}
                    />
                    </div>
                    <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="categoryName"
                    >
                        Category Name
                    </label>
                    <Input
                        type="text"
                        id="categoryName"
                        name="categoryName"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter Category Name"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                    />
                    </div>
                    <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="categoryDetails"
                    >
                        Category Details
                    </label>
                    <Input
                        type="text"
                        id="categoryDetails"
                        name="categoryDetails"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter Category Details"
                        value={categoryDetails}
                        onChange={(e) => setCategoryDetails(e.target.value)}
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
                        defaultValue={categoryStatus}
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