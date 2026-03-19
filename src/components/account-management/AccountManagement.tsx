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
import Image from "next/image";

// interface Category {
//   fld_CategoryId: number;
//   fld_CategoryCode: string;
//   fld_CategoryName: string;
//   fld_CategoryDetails: string;
//   fld_Status: string;
// }

interface Account {
    fld_UserId: number;
    fld_Username: string;
    fld_Email: string;
    fld_Name: string;
    fld_Sex: string;
    fld_Address: string;
    fld_Image: string;
    fld_Status: string;
    fld_UserLevel: string;
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

// interface CategoryTableProps {
//   onEdit: (category: Category) => void;
//   refreshKey: number;
// }

interface AccountTableProps {
  onEdit: (account: Account) => void;
  refreshKey: number;
}

const AccountTable: React.FC<AccountTableProps> = ({ onEdit, refreshKey }) => {
  const [tableData, setTableData] = useState<Account[]>([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const fetchTableData = async () => {
    try {
      const req = new FetchAPIData();
      const userData = localStorage.getItem("user");
      const loginAccount = userData ? JSON.parse(userData) : null;
      const response = await req.request("/account", loginAccount);
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

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">User</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Name</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Email</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Sex</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Address</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">User Level</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Status</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Action</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {paginatedData.map((account) => (
                <TableRow key={account.fld_UserId}>
                  {/* <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {category.fld_CategoryId}
                        </span>
                      </div>
                    </div>
                  </TableCell> */}
                  <TableCell className="px-3 py-3">
                   <div className="flex items-center gap-3">
                     <div className="h-[50px] w-[50px] overflow-hidden rounded-full">
                       <Image
                         width={80}
                         height={80}
                         src={account?.fld_Image ? 'data:image/jpeg;base64,' + account.fld_Image : '/images/user/user.jpg'}
                         className="h-[50px] w-[50px]"
                         alt="test"
                       />
                     </div>
                     <div>
                       <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                         {account.fld_UserId}
                       </p>
                       <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                         {account.fld_Username}
                       </span>
                     </div>
                   </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{account.fld_Name}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{account.fld_Email}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{account.fld_Sex}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{account.fld_Address}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{account.fld_UserLevel}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        account.fld_Status === "Active"
                          ? "success"
                          : account.fld_Status === "Inactive"
                          ? "warning"
                          : "error"
                      }
                    >
                      {account.fld_Status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <button className="text-blue-500 hover:underline" onClick={() => onEdit(account)}>edit</button>
                    <span>|</span>
                    <button className="text-blue-500 hover:underline" onClick={async () => {
                      const req = new FetchAPIData();
                      const response = await req.request("/account/setStatus", { fld_UserId: account.fld_UserId });
                      alert(response.message);
                      fetchTableData();
                    }}>
                      {account.fld_Status === "Active" ? "Inactive" : "Active"}
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

export default function AccountManagement() {
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState(0);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [sex, setSex] = useState("");
  const [image, setImage] = useState("");
  const [status, setStatus] = useState("Active");
  const [password, setPassword] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [userlevel, setUserlevel] = useState("Cashier");
  const [manage, setManage] = useState("Add Category");

  const options = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];

  const optionsSex = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ];

  const optionsUserlevel = [
    { value: "Owner", label: "Owner" },
    { value: "Cashier", label: "Cashier" },
  ];

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const triggerRefresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  const handleEdit = (account: Account) => {
    setUserId(account.fld_UserId);
    setUsername(account.fld_Username);
    setEmail(account.fld_Email);
    setName(account.fld_Name);
    setAddress(account.fld_Address);
    setPassword(""); // Reset password field on edit
    setSex(account.fld_Sex);
    setImage(account.fld_Image);
    setStatus(account.fld_Status);
    setUserlevel(account.fld_UserLevel);
    setManage("Edit Account");
    handleOpen();
  };

  return (
    <div>
      <div className="space-y-6">
        <ComponentCard title="Account Table">
          <div className="flex items-right gap-5">
            <Button size="small" variant="outlined" startIcon={<BoxIcon />} onClick={() =>
                 { 
                    setManage("Add Account"); 
                    setUserId(0);
                    setUsername("");
                    setEmail("");
                    setName("");
                    setAddress("");
                    setSex("");
                    setImage("");
                    setStatus("Active");
                    setUserlevel("Cashier");
                    handleOpen(); 
                 }
                 }>
              Add Account
            </Button>
          </div>
          <AccountTable onEdit={handleEdit} refreshKey={refreshKey} />
          <Modal open={open} onClose={handleClose}>
            <Box sx={modalStyle}>
              <center>
              <h2 className="text-lg font-semibold">{manage}</h2>
              </center>
                <form onSubmit={async (e) => {
                    e.preventDefault();
                    const req = new FetchAPIData();
                    if (manage === "Edit Account") {
                        const newAccount = {
                            fld_UserId: userId,
                            fld_Username: username,
                            fld_Email: email,
                            fld_Name: name,
                            fld_Address: address,
                            fld_Sex: sex,
                            fld_Image: image,
                            fld_Status: status,
                            fld_UserLevel: userlevel,
                        };
                        newAccount.fld_UserId = userId;
                        const response = await req.request("/account/edit", newAccount);
                        if (response.status === "success") {
                            alert(response.message);
                        } else {
                            alert(response.message);
                        }
                    }
                    else{
                        const newAccount = {
                            fld_Username: username,
                            fld_Email: email,
                            fld_Name: name,
                            fld_Address: address,
                            fld_Sex: sex,
                            fld_Image: image,
                            fld_Status: status,
                            fld_Password: password,
                            fld_UserLevel: userlevel,
                        };
                        const response = await req.request("/account/add", newAccount);
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
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userName">
                        Username
                    </label>
                    <Input
                        type="text"
                        id="userName"
                        name="userName"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter Username"
                        value={username}
                        onChange ={(e) => setUsername(e.target.value)}
                    />
                    </div>
                    {manage === "Add Account" && (
                        <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <Input
                            type="password"
                            id="password"
                            name="password"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        </div>
                    )}
                    <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="name"
                    >
                        Name
                    </label>
                    <Input
                        type="text"
                        id="name"
                        name="name"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter Category Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    </div>
                    <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="email"
                    >
                        Email
                    </label>
                    <Input
                        type="text"
                        id="email"
                        name="email"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter Category Details"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    </div>
                    <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="address"
                    >
                        Address
                    </label>
                    <Input
                        type="text"
                        id="address"
                        name="address"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter Address Details"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                    </div>
                    <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="sex"
                    >
                        Sex
                    </label>
                    <Select options={optionsSex}
                        id="sex"
                        name="sex"
                        placeholder="Select Sex"
                        defaultValue={sex}
                        onChange={(value) => setSex(value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    </div>
                    <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="userlevel"
                    >
                        User Level
                    </label>
                    <Select options={optionsUserlevel}
                        id="userlevel"
                        name="userlevel"
                        placeholder="Select User Level"
                        defaultValue={userlevel}
                        onChange={(value) => setUserlevel(value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                        defaultValue={status}
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