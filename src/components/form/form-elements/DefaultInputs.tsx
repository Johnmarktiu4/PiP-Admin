"use client";
import React, { useState, useEffect, useRef } from 'react';
import ComponentCard from '../../common/ComponentCard';
import Label from '../Label';
import Input from '../input/InputField';
import Select from '../Select';
import { ChevronDownIcon, EyeCloseIcon, EyeIcon, TimeIcon } from '../../../icons';
import DatePicker from '@/components/form/date-picker';
import { FetchAPIData } from '@/lib/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface DefaultInputsProps {
  setTransactionNumber: (value: string) => void;
  totalAmount: number;
  refreshTable: () => void;
}

interface Discount {
  fld_Id: number;
  fld_DiscountName: string;
  fld_Percentage: number;
  fld_Status: string;
}

export default function DefaultInputs({ setTransactionNumber, totalAmount, refreshTable }: DefaultInputsProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [transactionNumber, setLocalTransactionNumber] = useState("");
  const [Discounted, setDiscounted] = useState(0);
  const [Charge, setCharge] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [change, setChange] = useState(0);
  const [transactionType, setTransactionType] = useState("Dine-In");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [amountPaid, setAmountPaid] = useState(0);
  const [discountType, setDiscountType] = useState("None");
  const [transactionCheckNumber, setTransactionCheckNumber] = useState("");
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const tableRef = useRef<HTMLDivElement>(null);
  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));


const handleDownloadPDF = async () => {
  const element = tableRef.current;
  if (!element) return;

  // Clone the element to avoid modifying the original
  const clonedElement = element.cloneNode(true) as HTMLElement;

  // Apply receipt-style formatting
  clonedElement.style.padding = "10px";
  clonedElement.style.fontFamily = "monospace";
  clonedElement.style.fontSize = "12px";
  clonedElement.style.width = "300px"; // Approx. 80mm
  clonedElement.style.background = "#fff";

  // Create a temporary container to render the styled clone
  const tempContainer = document.createElement("div");
  tempContainer.style.position = "fixed";
  tempContainer.style.top = "-10000px";
  tempContainer.appendChild(clonedElement);
  document.body.appendChild(tempContainer);

  // Render canvas
  const canvas = await html2canvas(clonedElement, {
    scale: 1,
    useCORS: true,
  });

  // Clean up
  document.body.removeChild(tempContainer);

  // Convert to image
  const imgData = canvas.toDataURL("image/jpeg", 0.6);

  // Create PDF sized for receipt
  const pdf = new jsPDF("portrait", "mm", [80, canvas.height * 0.264583]);
  pdf.addImage(imgData, "JPEG", 0, 0, 80, canvas.height * 0.264583);
  pdf.save("Receipt.pdf");
};



  interface User {
    fld_Username: string;
    // add other properties if needed
  }
  const [user, setUser] = useState<User | null>(null);
  const fetchDiscount = async () => {
    try {
      const req = new FetchAPIData();
      const response = await req.requestWOParam("/discount/active");
      if (response.status === "success") {
        setDiscounts(response.data);
      } else {
        console.error("Failed to fetch discount data:", response.message);
      }
    } catch (error) {
      console.error("Error fetching discount data:", error);
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchDiscount();
  }, []);

  const options = [
    { value: "Gcash", label: "Gcash" },
    { value: "Paymaya", label: "Paymaya" },
    { value: "Cash", label: "Cash" },
  ];

  const optionsTransactionType = [
    {value: "Dine-In", label: "Dine-In"},
    {value: "Take-Out", label: "Take-Out"},
  ];

  const discountOptions = [
    ...discounts.map(discount => ({
      value: discount.fld_DiscountName,
      label: `${discount.fld_DiscountName} - ${discount.fld_Percentage}%`
    })),
    { value: "None", label: "None" },
  ];

  const handleChargeSelectChange = (value: string) => {
    console.log("Selected value:", value);
    if (value === "None" || value === "Cash")
    {
      setCharge(0);
      document.getElementById('transactionCheckNumber')?.setAttribute('disabled', 'true');
    }
    else{
      setCharge(5);
      document.getElementById('transactionCheckNumber')?.removeAttribute('disabled');
    }
    setPaymentMethod(value);
  };

  const handleDiscountSelectChange = (value: string) => {
    console.log("Selected value:", value);
    if (value === "None")
    {
      setDiscounted(0);
    }
    else{
      const selectedDiscount = discounts.find(discount => discount.fld_DiscountName === value);
      if (selectedDiscount) {
        const discountAmount = totalAmount * (selectedDiscount.fld_Percentage / 100);
        setDiscounted(discountAmount);
      } else {
        setDiscounted(0);
      }
    }
    setDiscountType(value);
  }

  const handleChangeComputation = (value: number) => {
    const discountedAmount = ((totalAmount + Charge) - Discounted).toFixed(2);
    console.log ("Change value: ₱", (value - Number(discountedAmount)).toFixed(2));
    if (value > Number(discountedAmount)) {
      setChange(value - Number(discountedAmount));
    }
    else {
      setChange(0);
    }
    setAmountPaid(value);
  }
  
  useEffect(() => {
    const now = new Date();
    const formatted = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}${String(now.getMilliseconds()).padStart(3, '0')}`;
    setTransactionNumber(formatted);
    setLocalTransactionNumber(formatted);
    console.log(formatted);
  }, [setTransactionNumber]);

  
  useEffect(() => {
    const computedFinal = totalAmount - Discounted + Charge;
    setFinalAmount(computedFinal);
    const selectedPaymentMethod = (document.getElementById('paymentMethod') as HTMLSelectElement)?.value;
    handleChargeSelectChange(selectedPaymentMethod);
    const selectedDiscountType = (document.getElementById('discountType') as HTMLSelectElement)?.value;
    handleDiscountSelectChange(selectedDiscountType);
    const recomputeChange = (document.getElementById('amountPaid') as HTMLInputElement)?.value;
    handleChangeComputation(Number(recomputeChange));
  }, [totalAmount, Discounted, Charge]);


  return (
    <ComponentCard title="Transaction Information">
      <div  ref={tableRef} className="space-y-6">
        {/* <div>
          <Label>Transaction Number</Label>
          <Input type="text" />
        </div> */}
        <form onSubmit={async (e) => {
            e.preventDefault();
            if (amountPaid < (totalAmount - Discounted + Charge)) {
              alert("Amount paid is insufficient.");
              return;
            }
            if ((totalAmount === 0) || (totalAmount < 0)) {
              alert("No items in the cart.");
              return;
            }
            const req = new FetchAPIData();
            const now = new Date();
            const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1)
                .padStart(2, '0')}-${String(now.getDate())
                .padStart(2, '0')}`;
            const newTransaction = {
              fld_TransactionNumber: transactionNumber,
              fld_DateCreated: formattedDate,
              fld_TotalAmount: totalAmount.toFixed(2),
              fld_Discount: Discounted.toFixed(2),
              fld_Charge: Charge.toFixed(2),
              fld_DiscountedAmount: (totalAmount - Discounted).toFixed(2),
              fld_AmountPaid: amountPaid.toFixed(2),
              fld_DiscountType: discountType,
              fld_PaymentMethod: paymentMethod,
              fld_TransactionType: transactionType,
              fld_TransactionCheckNumber: transactionCheckNumber,
              fld_Change: change.toFixed(2),
              fld_TransactionStatus: 'Pending',
              fld_Username: user?.fld_Username
            };
            const response = await req.request("/transaction/addTransaction", newTransaction);
            if (response) {
              console.log("Transaction added successfully:", response);
              handleDownloadPDF();
              alert(response.message);
              await delay(2000);
              window.location.href = "/pos";
            } else {
              console.error("Failed to add transaction");
              alert(response.message);
            }
          }
        }>
        <div>
          <Label>Transaction Number</Label>
          <Input type="text" id="transactionNumber" value={transactionNumber} readOnly />
        </div>
        <div>
          <Label>Discount Type</Label>
          <div className="relative">
            <Select
            id='discountType'
            options={discountOptions}
            placeholder="Select an discount"
            onChange={handleDiscountSelectChange}
            defaultValue='None'
            className="dark:bg-dark-900"
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <ChevronDownIcon/>
            </span>
          </div>
        </div>
        <div>
          <Label>Payment Method</Label>
          <div className="relative">
            <Select
            options={options}
            id='paymentMethod'
            placeholder="Select an payment method"
            onChange={handleChargeSelectChange}
            defaultValue='Cash'
            className="dark:bg-dark-900"
          />
             <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <ChevronDownIcon/>
            </span>
          </div>
        </div>
        <div>
          <Label>Transaction Type</Label>
          <div className="relative">
            <Select
            options={optionsTransactionType}
            id='transactionType'
            placeholder="Select an transaction type"
            onChange={(value) => setTransactionType(value)}
            defaultValue='Dine-In'
            className="dark:bg-dark-900"
          />
             <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <ChevronDownIcon/>
            </span>
          </div>
        </div>
        {/* <div>
          <Label>Password Input</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
            >
              {showPassword ? (
                <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
              ) : (
                <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
              )}
            </button>
          </div>
        </div> */}
        <div>
          <Label>Total Amount</Label>
          <Input type="text" value={`₱${totalAmount.toFixed(2)}`} readOnly />
        </div>
        <div>
          <Label>Charge</Label>
          <Input type="text" value={`₱${Charge.toFixed(2)}`} readOnly />
        </div>
        <div>
          <Label>Discount</Label>
          <Input type="text" value={`₱${Discounted.toFixed(2)}`} readOnly />
        </div>
        <div>
          <Label>Discounted Amount</Label>
          <Input type="text" id="discountedAmount" value={`₱${((totalAmount + Charge) - Discounted).toFixed(2)}`} readOnly />
        </div>
        <div>
          <Label>Amount Paid</Label>
          <Input type="number" id="amountPaid" onChange={(e) => handleChangeComputation(Number(e.target.value))} />
        </div>
        <div>
          <Label>Change</Label>
          <Input type="text" value={`₱${change.toFixed(2)}`} readOnly />
        </div>
        <div>
          <Label>Transaction Check Number</Label>
          <Input type="text" id="transactionCheckNumber" placeholder="This only applicable for cashless transaction" onChange={(e) => setTransactionCheckNumber(e.target.value)} />
        </div>
        <br />
        <center>
        <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
          <span>Cancel Order</span>
        </button>
                <span className="inline-flex items-center gap-2 px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs" />
        <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
          <span>Submit</span>
        </button>
        </center>
        </form>
      </div>
    </ComponentCard>
  );
}
