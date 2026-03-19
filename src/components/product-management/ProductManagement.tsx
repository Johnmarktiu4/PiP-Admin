"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
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
  const rowsPerPage = 10;

  const fetchTableData = async () => {
    try {
      const req = new FetchAPIData();
      const response = await req.requestWOParam("/product");
      if (response.status === "success") {
        setTableData(response.data);
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
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Product ID</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Product Code</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Product Name</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Product Details</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Price</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Unit Measure</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Quantity</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Moving Status</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Status</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Action</TableCell>
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
                         src={product?.fld_Image ? 'data:image/jpeg;base64,' + product.fld_Image : '/images/product/noimage.jpg'}
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
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <button className="text-blue-500 hover:underline" onClick={() => onEdit(product)}>edit</button>
                    <span>|</span>
                    <button className="text-blue-500 hover:underline" onClick={async () => {
                      const req = new FetchAPIData();
                      const response = await req.request("/product/setStatus", { fld_Id: product.fld_Id });
                      alert(response.message);
                      fetchTableData();
                    }}>
                      {product.fld_Status === "Active" ? "Inactive" : "Active"}
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

export default function ProductManagement() {
  const [open, setOpen] = useState(false);
  const [Id, setId] = useState(0);
  const [productCode, setProductCode] = useState("");
  const [productName, setProductName] = useState("");
  const [productDetails, setProductDetails] = useState("");
  const [productStatus, setStatus] = useState("Active");
  const [productUnit, setProductUnit] = useState("pcs");
  const [productPrice, setProductPrice] = useState("");
  const [productMovingStatus, setProductMovingStatus] = useState("Fast Moving");
  const [refreshKey, setRefreshKey] = useState(0);
  const [manage, setManage] = useState("Add Product");
  const [image, setImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
 
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    console.log(target.files);
    if (target.files && target.files[0]) {
      try {
        const base64 = await ConvertImage.fileToBase64(target.files[0]);
        setImage(base64 as unknown as File);
      } catch (error) {
        console.error("Failed to convert file to base64", error);
      }
    }
  };

  const clearFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const triggerRefresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

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
    setImage(image);
    handleOpen();
  };

  return (
    <div>
      <div className="space-y-6">
        <ComponentCard title="Product Table">
          <div className="flex items-right gap-5">
            <Button size="small" variant="outlined" startIcon={<BoxIcon />} onClick={() =>
                 { 
                    setManage("Add Product"); 
                    setId(0);
                    setProductCode("");
                    setProductName("");
                    setProductDetails("");
                    setStatus("Active");
                    setProductUnit("pcs");
                    setProductMovingStatus("Fast Moving");
                    setImage(null);
                    handleOpen();
                 }
                 }>
              Add Product
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
                    const req = new FetchAPIData();
                    if (Number(productPrice) < 1 || isNaN(Number(productPrice))) {
                      return alert("Please enter a valid price.");
                    }
                     if (manage === "Edit Product") {
                        const newProduct = {
                            fld_Id: Id,
                            fld_ProductCode: productCode,
                            fld_ProductName: productName,
                            fld_ProductDescription: productDetails,
                            fld_Status: productStatus,
                            fld_Unit: productUnit,
                            fld_Price: productPrice,
                            fld_MovingStatus: productMovingStatus
                        };
                        if(image){
                            newProduct.fld_Image = image;   
                        }
                        newProduct.fld_Id = Id;
                        console.log(newProduct);
                        const response = await req.request("/product/edit", newProduct);
                        if (response.status === "success") {
                            alert(response.message);
                        } else {
                            alert(response.message);
                        }
                    }
                    else{
                        const newProduct = {
                            fld_ProductCode: productCode,
                            fld_ProductName: productName,
                            fld_ProductDescription: productDetails,
                            fld_Status: productStatus,
                            fld_Unit: productUnit,
                            fld_Price: productPrice,
                            fld_MovingStatus: productMovingStatus,
                            fld_Image: image
                        };
                        const response = await req.request("/product/add", newProduct);
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
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productImage">
                        Product Image
                    </label>
                    <Input
                        type="file"
                        id="productImage"
                        name="productImage"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Select Product Image"
                        inputRef={fileInputRef}
                        onChange ={handleFileChange}
                    />
                    <Button onClick={clearFileInput}>Clear</Button>
                    </div>
                    <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productCode">
                        Product Code
                    </label>
                    <Input
                        type="text"
                        id="productCode"
                        name="productCode"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter Product Code"
                        value={productCode}
                        onChange ={(e) => setProductCode(e.target.value)}
                    />
                    </div>
                    <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="productName"
                    >
                        Product Name
                    </label>
                    <Input
                        type="text"
                        id="productName"
                        name="productName"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter Product Name"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                    />
                    </div>
                    <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="productDetails"
                    >
                        Product Details
                    </label>
                    <Input
                        type="text"
                        id="productDetails"
                        name="productDetails"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter Product Details"
                        value={productDetails}
                        onChange={(e) => setProductDetails(e.target.value)}
                    />
                    </div>
                    <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="productPrice"
                    >
                        Product Price
                    </label>
                    <Input
                        type="number"
                        id="productPrice"
                        name="productPrice"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="0.00"
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                    />
                    </div>
                    <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="productUnit"
                    >
                        Product Unit
                    </label>
                    <Select options={unitOptions}
                        id="productUnit"
                        name="productUnit"
                        placeholder="Select Unit"
                        defaultValue={productUnit}
                        onChange={(value) => setProductUnit(value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    </div>
                    <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="movingStatus"
                    >
                        Moving Status
                    </label>
                    <Select options={optionMoving}
                        id="movingStatus"
                        name="movingStatus"
                        placeholder="Select Moving Status"
                        defaultValue={productMovingStatus}
                        onChange={(value) => setProductMovingStatus(value)}
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
                        defaultValue={productStatus}
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