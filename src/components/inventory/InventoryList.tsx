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

interface Product {
  fld_Id: number;
  fld_ProductCode: string;
  fld_ProductName: string;
  fld_ProductDescription: string;
  fld_Price: string;
  fld_Unit: string;
  fld_Image: string;
  fld_Quantity: number;
  fld_Status: string;
  fld_MovingStatus: string;
}

interface Stock {
  fld_StockId: number;
  fld_ProductId: number;
  fld_Quantity: string;
  fld_ExpirationDate: string;
  fld_Movement: string;
  fld_Remarks: string;
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

interface ProductTableProps {
  onEdit: (product: Product) => void;
  refreshKey: number;
}

const ProductTable: React.FC<ProductTableProps> = ({ onEdit, refreshKey }) => {
  const [tableData, setTableData] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [optionName, setOptionName] = useState<string[]>([]);
  const rowsPerPage = 10;

  const fetchTableData = async () => {
    try {
      const req = new FetchAPIData();
      const response = await req.requestWOParam("/product");
      if (response.status === "success") {
        setTableData(response.data);
        const uniqueNames = Array.from(new Set(response.data.map((item: Product) => item.fld_ProductName))) as string[];
        setOptionName(uniqueNames);
      } else {
        console.error("Failed to fetch product data:", response.message);
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
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
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Package ID</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Package Code</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Package Name</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Package Details</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Price</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Unit Measure</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Quantity</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Stock Status</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Moving Status</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Status</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {paginatedData.map((product) => (
                <TableRow key={product.fld_Id}>
                  <TableCell className="px-3 py-3">
                   <div className="flex items-center gap-3">
                     <div className="h-[50px] w-[50px] overflow-hidden rounded-full">
                       <Image
                         width={80}
                         height={80}
                         src={product?.fld_Image ? 'data:image/jpeg;base64,' + product.fld_Image : '/images/user/user.jpg'}
                         className="h-[50px] w-[50px]"
                         alt="test"
                       />
                     </div>
                     <div>
                       <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                         {product.fld_Id}
                       </p>
                     </div>
                   </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{product.fld_ProductCode}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{product.fld_ProductName}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{product.fld_ProductDescription}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{product.fld_Price}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{product.fld_Unit}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{product.fld_Quantity}</TableCell>
                  <TableCell className="px-8 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        product.fld_Quantity > 10
                          ? "success"
                          : product.fld_Quantity > 0 && product.fld_Quantity <= 10
                          ? "warning"
                          : "error"
                      }
                    >
                      {
                        product.fld_Quantity > 10
                          ? "In Stock"
                          : product.fld_Quantity > 0 && product.fld_Quantity <= 10
                          ? "Low Stock"
                          : "Out of Stock"
                      }
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        product.fld_MovingStatus === "Fast Moving"
                          ? "success"
                          : product.fld_MovingStatus === "Slow Moving"
                          ? "warning"
                          : "error"
                      }
                    >
                      {product.fld_MovingStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        product.fld_Status === "Active"
                          ? "success"
                          : product.fld_Status === "Inactive"
                          ? "warning"
                          : "error"
                      }
                    >
                      {product.fld_Status}
                    </Badge>
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

export default function ProductManagement() {
  const [open, setOpen] = useState(false);
  const [Id, setId] = useState(0);
  const [PID, setPID] = useState("");
  const [productCode, setProductCode] = useState("");
  const [productName, setProductName] = useState("");
  const [productDetails, setProductDetails] = useState("");
  const [productStatus, setStatus] = useState("Active");
  const [productUnit, setProductUnit] = useState("pcs");
  const [productPrice, setProductPrice] = useState("");
  const [productMovingStatus, setProductMovingStatus] = useState("Fast Moving");
  const [Quantity, setQuantity] = useState("");
  const [Expiration, setExpiration] = useState("");
  const [Movement, setMovement] = useState("Stock In");
  const [Remarks, setRemarks] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [manage, setManage] = useState("Add Stocks");
  const [productId, setProductId] = useState<Product[]>([]);

  const fetchProductIds = async () => {
    try {
      const req = new FetchAPIData();
      const response = await req.requestWOParam("/product");
      if (response.status === "success") {
        setProductId(response.data);
      } else {
        console.error("Failed to fetch product data:", response.message);
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };
  
  useEffect(() => {
    fetchProductIds();
  }, []);

  const optionsId = productId.map((product) => ({
    value: String(product.fld_Id),
    label: product.fld_ProductName,
  }));

  const options = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];

  const optionMoving = [
    { value: "Fast Moving", label: "Fast Moving" },
    { value: "Slow Moving", label: "Slow Moving" },
  ];

  const unitOptions = [
    { value: "pcs", label: "pcs" },
    { value: "kg", label: "kg" },
    { value: "liters", label: "liters" },
    { value: "grams", label: "grams" },
    { value: "packs", label: "packs" }
  ];

  const optionMovement = [
    { value: "Stock In", label: "Stock In" },
    { value: "Stock Out", label: "Stock Out" },
  ];

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const triggerRefresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  const handleEditStock = (stock: Stock) => {
    setId(stock.fld_StockId);
    setQuantity(stock.fld_Quantity);
    setExpiration(stock.fld_ExpirationDate);
    setMovement(stock.fld_Movement);
    setRemarks(stock.fld_Remarks);
    setManage("Update Stocks");
    handleOpen();
  };

  const handleEdit = (product: Product) => {
    setId(product.fld_Id);
    setProductCode(product.fld_ProductCode);
    setProductName(product.fld_ProductName);
    setProductDetails(product.fld_ProductDescription);
    setStatus(product.fld_Status);
    setProductUnit(product.fld_Unit);
    setProductPrice(product.fld_Price);
    setProductMovingStatus(product.fld_MovingStatus);
    setManage("Edit Product");
    handleOpen();
  };

  return (
    <div>
      <div className="space-y-6">
        <ComponentCard title="Inventory Table">
          <div className="flex items-right gap-5">
            <Button size="small" variant="outlined" startIcon={<BoxIcon />} onClick={() =>
                 { 
                    setManage("Update Stocks"); 
                    // setId(0);
                    // setProductCode("");
                    // setProductName("");
                    // setProductDetails("");
                    // setStatus("Active");
                    // setProductUnit("pcs");
                    // setProductMovingStatus("Fast Moving");
                    handleOpen();
                 }
                 }>
              Update Stocks
            </Button>
          </div>
          <ProductTable onEdit={handleEdit} refreshKey={refreshKey} />
          <Modal open={open} onClose={handleClose}>
            <Box sx={modalStyle}>
              <center>
              <h2 className="text-lg font-semibold">{manage}</h2>
              </center>
                <form onSubmit={async (e) => {
                    e.preventDefault();
                    if (Quantity === "" || Number(Quantity) < 1) {
                        return alert("Please fill in all fields correctly");
                    }
                    if (Movement === "Stock In") {
                      if (Expiration === "" || Expiration < new Date().toISOString().split("T")[0]) {
                          return alert("Please fill in all fields correctly");
                      }
                    }
                    const req = new FetchAPIData();
                        const newProduct = {
                              fld_ProductId: PID,
                              fld_Quantity: Quantity,
                              fld_ExpirationDate: Expiration,
                              fld_Movement: Movement,
                              fld_Remarks: Remarks
                        };
                        const response = await req.request("/stock/update", newProduct);
                        if (response.status === "success") {
                            alert(response.message);
                        } else {
                            alert(response.message);
                        }
                    triggerRefresh();
                    handleClose();
                }}>
                    <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productId">
                        Product
                    </label>
                    <Select 
                        options={optionsId}
                        id="productId"
                        name="productId"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Select Product"
                        defaultValue={PID}
                        onChange ={(value) => setPID(value)}
                    />
                    </div>
                    <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="quantity"
                    >
                        Quantity
                    </label>
                    <Input
                        type="number"
                        id="quantity"
                        name="quantity"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={Quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                    />
                    </div>
                    <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="expiration"
                    >
                        Expiration Date
                    </label>
                    <Input
                        type="date"
                        id="expiration"
                        name="expiration"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={Expiration}
                        onChange={(e) => setExpiration(e.target.value)}
                    />
                    </div>
                    <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="movementStatus"
                    >
                        Movement Status
                    </label>
                    <Select options={optionMovement}
                        id="movementStatus"
                        name="movementStatus"
                        placeholder="Select Movement"
                        defaultValue={Movement}
                        onChange={(value) => setMovement(value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    </div>
                    <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="remarks">
                        Remarks
                    </label>
                    <Input
                        type="text"
                        id="remarks"
                        name="remarks"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter Remarks"
                        value={Remarks}
                        onChange ={(e) => setRemarks(e.target.value)}
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