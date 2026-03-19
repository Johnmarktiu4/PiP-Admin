"use client";
import React, { useEffect, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import DefaultInputs from "../form/form-elements/DefaultInputs";
import {FetchAPIData} from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import Badge from "../ui/badge/Badge";
import Image from "next/image";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";

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

interface Menu {
  fld_Id: number;
  fld_ProductCode: string;
  fld_ProductName: string;
  fld_Price: string;
  fld_Quantity: number;
  fld_Image: string;
  action: string;
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
  onEdit: (orders: Orders) => void;
  refreshKey: number;
  transNumber: string;
  setTotalAmount: (amount: number) => void;
}

interface Order {
  id: number;
  order: {
    image: string;
    name: string;
  };
  price: string;
  quantity: number;
}

// Define the table data using the interface
const tableData2: Order[] = [
  {
    id: 1,
    order: {
      image: "/images/product/f1.jpg",
      name: "Delicious Pizza",
    },
    price: "₱2399.00",
    quantity: 2,
  },
  {
    id: 2,
    order: {
      image: "/images/product/f3.jpg",
      name: "Delicious Burger",
    },
    price: "₱2399.00",
    quantity: 1,
  },
  {
    id: 3,
    order: {
      image: "/images/product/f3.jpg",
      name: "Not Delicious Pizza",
    },
    price: "₱2399.00",
    quantity: 3,
  },
  {
    id: 4,
    order: {
      image: "/images/product/f7.jpg",
      name: "Delicious Halo-Halo",
      },
    price: "₱2399.00",
    quantity: 1,
  }

];

interface MenuTableProps {
  onSelect: (menu: Menu) => void;
  refreshKey: number;
}

const MenuTable: React.FC<MenuTableProps> = ({ onSelect, refreshKey }) => {
  const [table1, setTable1] = useState<Menu[]>([]);

    const fetchMenu = async () => {
      try {
        const req = new FetchAPIData();
        const response = await req.requestWOParam("/product/getActiveProduct");
        if (response.status === "success") {
          setTable1(response.data);
        } else {
          console.error("Failed to fetch menu data:", response.message);
        }
      } catch (error) {
        console.error("Error fetching menu data:", error);
      }
    };

  useEffect(() => {
    fetchMenu();
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[900px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-10 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Menu Item
                </TableCell>
                <TableCell isHeader className="px-6 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Price
                </TableCell>
                <TableCell isHeader className="px-6 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Status
                </TableCell>
                <TableCell isHeader className="px-6 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {table1.map((menu) => (
                <TableRow key={menu.fld_Id}>
                  <TableCell className="px-7 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 overflow-hidden rounded-full">
                        <Image width={40} height={40} src= {'data:image/jpeg;base64,' + menu.fld_Image} alt={menu.fld_ProductName} />
                        </div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {menu.fld_ProductName}
                        </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    ₱{menu.fld_Price}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        menu.fld_Quantity > 10
                          ? "success"
                          : menu.fld_Quantity > 0 && menu.fld_Quantity <= 10
                          ? "warning"
                          : "error"
                      }
                    >
                      {
                        menu.fld_Quantity > 10
                          ? "In Stock"
                          : menu.fld_Quantity > 0 && menu.fld_Quantity <= 10
                          ? "Low Stock"
                          : "Out of Stock"
                      }
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 hover:cursor-pointer">
                    <Badge
                      size="sm"
                      color="primary"
                      onClick={() => onSelect(menu)}
                    >
                      {
                        menu.fld_Quantity > 0
                          ? "Select"
                          : ""
                      }
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};


const OrderTable: React.FC<OrdersTableProps> = ({ onEdit, refreshKey, transNumber, setTotalAmount }) => {
  const [tableData, setTableData] = useState<Orders[]>([]);

  const fetchTableData = async () => {
      try {
        const req = new FetchAPIData();
        const s = {
          fld_TransactionId: transNumber
        }
        console.log("Transaction Number in OrderTable:", s);
        const response = await req.request("/order/orderList", s);
        if (response.status === "success") {
          setTableData(response.data);    
          const total = response.data.reduce((sum: number, order: Orders) => {
            return sum + parseFloat(order.fld_Price) * order.fld_Qty;
          }, 0);
          setTotalAmount(total);
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
    }, [refreshKey]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
        <div className="min-w-[900px]">
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
                <TableCell isHeader className="px-10 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Action
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
                    <TableCell className="px-8 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <button className="text-blue-500 hover:underline">
                        edit
                    </button>
                    <span>|</span>
                    <button className="text-blue-500 hover:underline" onClick={
                      async () => {
                        const req = new FetchAPIData();
                        const s = {
                          fld_Id: orders.fld_Id
                        }
                        const response = await req.request("/order/deleteOrder", s);
                        if (response.status === "success") {
                          alert(response.message);
                          fetchTableData();
                        } else {
                          alert(response.message);
                        }
                      }
                    }>
                        delete
                    </button>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </div>
        </div>
    </div>
  );
};

export default function PointOfSale() {
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [warning, setWarning] = useState("");
  const [transactionNumber, setTransactionNumber] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  interface User {
    fld_Username: string;
    // add other properties if needed
  }
  const [user, setUser] = useState<User | null>(null);
  const [qty, setQty] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const refreshTable = () => {
    setRefreshKey(prev => prev + 1);
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleSelect = (menu: Menu) => {
    setSelectedMenu(menu);
    setIsModalOpen(true);
  };
    
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);

    if (!selectedMenu) {
      setSelectedQuantity(1);
      setWarning("No menu item selected.");
      return;
    }

    if (!isNaN(value)) {
      if (value > selectedMenu.fld_Quantity) {
        setSelectedQuantity(selectedMenu.fld_Quantity);
        setWarning(`Maximum available quantity is ${selectedMenu.fld_Quantity}.`);
      } else if (value < 1) {
        setSelectedQuantity(1);
        setWarning("Minimum quantity is 1.");
      } else {
        setSelectedQuantity(value);
        setWarning("");
        setQty(value);
      }
    } else {
      setSelectedQuantity(1);
      setWarning("Please enter a valid number.");
    }
  };

  return (
    <div className="flex flex-row gap-6 w-full">
     {/* Left side: Tables */}
      <div className="flex-1 flex flex-col gap-6 overflow-x-auto">
        <MenuTable onSelect={handleSelect} refreshKey={refreshKey} />
        <OrderTable onEdit={() => {}} refreshKey={refreshKey} transNumber={transactionNumber} setTotalAmount={setTotalAmount} />
      </div>

      {/* Right side: POS Form */}
      <div className="w-[500px] shrink-0">
        <ComponentCard title="POS Form">
          <DefaultInputs setTransactionNumber={setTransactionNumber} totalAmount={totalAmount} refreshTable={refreshTable} />
        </ComponentCard>
      </div>
      
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box sx={modalStyle}>
          <center>
              <h2 className="text-lg font-semibold">Selected Item</h2>
          </center>
          <form onSubmit={async (e) => {
            e.preventDefault();
            // Handle form submission
            if (!selectedMenu) {
              setWarning("No menu item selected.");
              return;
            }
            if (warning !== "") {
              alert(warning);

            }
            else
            {
              const req = new FetchAPIData();
              const now = new Date();
              const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1)
                .padStart(2, '0')}-${String(now.getDate())
                .padStart(2, '0')}`;
              const newOrder = {
                fld_TransactionId: transactionNumber,
                fld_ProductId: selectedMenu.fld_Id,
                fld_Username: user?.fld_Username,
                fld_Price: selectedMenu.fld_Price,
                fld_Qty: qty,
                fld_DateCreated: formattedDate
              };
              const response = await req.request("/order/selectOrder", newOrder);
              if (response.status === "success") {
                  console.log(JSON.stringify(response.data));
                  alert(response.message);
                  setIsModalOpen(false);
                  setRefreshKey(prev => prev + 1); // 🔁 trigger refresh
              } else {
                  alert(response.message);
              }
            }
          }}>
            {selectedMenu && (
              <>
                <div>
                  <center>
                    <Image
                      src={`data:image/jpeg;base64,${selectedMenu.fld_Image}`}
                      alt={selectedMenu.fld_ProductName}
                      width={100}
                      height={100}
                    />
                  </center>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fld_Id">
                    ID
                  </label>
                  <Input
                    type="text"
                    id="fld_Id"
                    value={selectedMenu.fld_Id}
                    readOnly
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fld_ProductName">
                    Product Name
                  </label>
                  <Input
                    type="text"
                    id="fld_ProductName"
                    value={selectedMenu.fld_ProductName}
                    readOnly
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fld_Price">
                    Price
                  </label>
                  <Input
                    type="text"
                    id="fld_Price"
                    value={selectedMenu.fld_Price}
                    readOnly
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fld_AvailableQuantity">
                    Available Quantity
                  </label>
                  <Input
                    type="text"
                    id="fld_AvailableQuantity"
                    value={selectedMenu.fld_Quantity}
                    readOnly
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fld_Quantity">
                    Selected Quantity
                  </label>
                  <Input
                    type="number"
                    id="fld_Quantity"
                    min={1}
                    max={selectedMenu.fld_Quantity}
                    onChange={handleQuantityChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />      
                  {warning && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">{warning}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    SubTotal : <span className="font-normal">₱{(parseFloat(selectedMenu.fld_Price) * selectedQuantity).toFixed(2)}</span>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <Button variant="contained" color="primary" type="submit">
                    Save
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={() => setIsModalOpen(false)} className="ml-2">
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </form>
        </Box>
      </Modal>
    </div>
  );
}

