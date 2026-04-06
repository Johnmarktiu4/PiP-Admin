"use client";
import React, { useEffect, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import { FetchAPIData } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Button from "@mui/material/Button";

interface DeceasedTransaction {
  fld_DeceasedId: number;
  fld_TransactionNumber: string;
  fld_TransactionStatus: string;
  // Name
  fld_FirstName: string;
  fld_MiddleName: string;
  fld_LastName: string;
  // Vital
  fld_DateOfBirth: string;
  fld_DateOfDeath: string;
  fld_TimeOfDeath: string;
  fld_BurialDate: string;
  fld_BurialTime: string;
  fld_Age: number | string;
  fld_Sex: string;
  fld_Religion: string;
  fld_Citizenship: string;
  fld_CivilStatus: string;
  // Background
  fld_Occupation: string;
  fld_Address: string;
  fld_FatherName: string;
  fld_MotherName: string;
  fld_Cemetery: string;
  // Informant
  fld_Informant: string;
  fld_Relationship: string;
  fld_InformantAddress: string;
  fld_ContactNumber: string;
  // Package
  fld_Package: string;
  fld_PackagePrice: string;
  // Pickup & files
  fld_PickupAddress: string;
  fld_Payment: string;
  fld_PaymentImage?: string;
}

interface TransactionTableProps {
  refreshKey: number;
}

// ─── Payment Receipt Modal ────────────────────────────────────────────────────

function PaymentModal({
  filename,
  deceasedId,
  onClose,
}: {
  filename: string;
  deceasedId: number;
  onClose: () => void;
}) {
  const [imgSrc, setImgSrc]   = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    const url = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api") + `/deceased/payment/${deceasedId}`;
    fetch(url, {
      method: "GET",
      headers: {
        "Authorization": process.env.NEXT_PUBLIC_TOKEN ?? "Test*1234",
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const contentType = res.headers.get("content-type") ?? "";
        if (contentType.includes("application/json")) {
          // wrapped in JSON — extract base64
          const json = await res.json();
          if (json.status === "success" && json.data?.fld_Payment) {
            setImgSrc(`data:image/jpeg;base64,${json.data.fld_Payment}`);
          } else {
            setError("Could not load receipt.");
          }
        } else {
          // raw binary — convert blob to object URL
          const blob = await res.blob();
          setImgSrc(URL.createObjectURL(blob));
        }
      })
      .catch((err) => setError(`Failed to load receipt: ${err?.message ?? err}`))
      .finally(() => setLoading(false));

    return () => {
      // revoke object URL on unmount to free memory
      if (imgSrc) URL.revokeObjectURL(imgSrc);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deceasedId]);

  // close on backdrop click
  function handleBackdrop(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={handleBackdrop}
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
            Payment Receipt — <span className="font-normal text-gray-500"></span>
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        {loading && (
          <p className="py-10 text-center text-sm text-gray-400">Loading...</p>
        )}
        {error && (
          <p className="py-10 text-center text-sm text-red-500">{error}</p>
        )}
        {imgSrc && !loading && (
          <img
            src={imgSrc}
            alt="Payment receipt"
            className="max-h-[70vh] w-full rounded-lg object-contain"
            onError={() => setError("Image could not be displayed.")}
          />
        )}
      </div>
    </div>
  );
}

// ─── Update Deceased Modal ────────────────────────────────────────────────────

const STATUS_OPTIONS = ["PENDING", "UNPAID", "PARTIALY PAID", "APPROVED"];

function UpdateDeceasedModal({
  row,
  onClose,
  onSaved,
}: {
  row: DeceasedTransaction;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm]               = useState({ ...row });
  const [paymentFile, setPaymentFile]       = useState<File | null>(null);
  const [paymentPreview, setPaymentPreview] = useState<string | null>(null);
  const [paymentLabel, setPaymentLabel]     = useState(row.fld_Payment || "Click or drag a file here");
  const [obituaryFile, setObituaryFile]         = useState<File | null>(null);
  const [obituaryPreview, setObituaryPreview]   = useState<string | null>(null);
  const [obituaryLabel, setObituaryLabel]       = useState("Click or drag a photo here");
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState<string | null>(null);

  // fetch existing binary blobs on mount
  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api";
    const headers = { Authorization: process.env.NEXT_PUBLIC_TOKEN ?? "Test*1234" };

    // payment receipt
    fetch(`${base}/deceased/payment/${row.fld_DeceasedId}`, { headers })
      .then(async (res) => {
        if (!res.ok) return;
        const ct = res.headers.get("content-type") ?? "";
        if (ct.includes("application/json")) {
          const json = await res.json();
          if (json.data?.fld_Payment) setPaymentPreview(`data:image/jpeg;base64,${json.data.fld_Payment}`);
        } else {
          const blob = await res.blob();
          setPaymentPreview(URL.createObjectURL(blob));
        }
      })
      .catch(() => {/* no preview available */});

    // obituary image
    fetch(`${base}/deceased/obituary/${row.fld_DeceasedId}`, { headers })
      .then(async (res) => {
        if (!res.ok) return;
        const ct = res.headers.get("content-type") ?? "";
        if (ct.includes("application/json")) {
          const json = await res.json();
          if (json.data?.fld_ObituaryImage) setObituaryPreview(`data:image/jpeg;base64,${json.data.fld_ObituaryImage}`);
        } else {
          const blob = await res.blob();
          setObituaryPreview(URL.createObjectURL(blob));
        }
      })
      .catch(() => {/* no preview available */});

    return () => {
      if (paymentPreview?.startsWith("blob:"))  URL.revokeObjectURL(paymentPreview);
      if (obituaryPreview?.startsWith("blob:")) URL.revokeObjectURL(obituaryPreview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [row.fld_DeceasedId]);

  function set(field: keyof DeceasedTransaction, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const fd = new FormData();
      // append all text fields
      (Object.keys(form) as (keyof DeceasedTransaction)[]).forEach((k) => {
        if (k !== "fld_PaymentImage") fd.append(k, String(form[k] ?? ""));
      });
      if (paymentFile)  fd.append("fld_Payment", paymentFile);
      if (obituaryFile) fd.append("fld_ObituaryImage", obituaryFile);

      const { requestFormData } = await import("@/lib/api");
      const res = await requestFormData(`/deceased/update/${row.fld_DeceasedId}`, fd);
      if (res.status === "success") {
        onSaved();
        onClose();
      } else {
        setError(res.message ?? "Update failed.");
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  function handleBackdrop(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  const inputCls = "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white";
  const labelCls = "mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400";
  const fieldsetCls = "rounded-xl border border-gray-200 p-4 dark:border-gray-700";
  const legendCls = "px-1 text-xs font-semibold uppercase text-gray-400";

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 py-8"
      onClick={handleBackdrop}
    >
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl dark:bg-gray-900" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <div>
            <h3 className="text-base font-semibold text-gray-800 dark:text-white">Update Registration</h3>
            <p className="text-xs text-gray-400">Señora De Porta Vaga Funeral Homes</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" aria-label="Close">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">

          {/* Transaction */}
          <fieldset className={fieldsetCls}>
            <legend className={legendCls}>Transaction</legend>
            <div className="mt-2">
              <label className={labelCls}>Transaction No.</label>
              <input className={inputCls} value={form.fld_TransactionNumber} readOnly />
            </div>
          </fieldset>

          {/* Name */}
          <fieldset className={fieldsetCls}>
            <legend className={legendCls}>Name of Deceased</legend>
            <div className="mt-2 grid grid-cols-3 gap-3">
              <div><label className={labelCls}>First Name</label><input className={inputCls} value={form.fld_FirstName} onChange={(e) => set("fld_FirstName", e.target.value)} required /></div>
              <div><label className={labelCls}>Middle Name</label><input className={inputCls} value={form.fld_MiddleName} onChange={(e) => set("fld_MiddleName", e.target.value)} /></div>
              <div><label className={labelCls}>Last Name</label><input className={inputCls} value={form.fld_LastName} onChange={(e) => set("fld_LastName", e.target.value)} required /></div>
            </div>
          </fieldset>

          {/* Vital */}
          <fieldset className={fieldsetCls}>
            <legend className={legendCls}>Vital Information</legend>
            <div className="mt-2 space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div><label className={labelCls}>Date of Birth</label><input type="date" className={inputCls} value={form.fld_DateOfBirth} onChange={(e) => set("fld_DateOfBirth", e.target.value)} /></div>
                <div><label className={labelCls}>Date of Death</label><input type="date" className={inputCls} value={form.fld_DateOfDeath} onChange={(e) => set("fld_DateOfDeath", e.target.value)} /></div>
                <div><label className={labelCls}>Time of Death</label><input type="time" className={inputCls} value={form.fld_TimeOfDeath} onChange={(e) => set("fld_TimeOfDeath", e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelCls}>Burial Date</label><input type="date" className={inputCls} value={form.fld_BurialDate} onChange={(e) => set("fld_BurialDate", e.target.value)} /></div>
                <div><label className={labelCls}>Burial Time</label><input type="time" className={inputCls} value={form.fld_BurialTime} onChange={(e) => set("fld_BurialTime", e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-4 gap-3">
                <div><label className={labelCls}>Age</label><input type="number" min={0} max={150} className={inputCls} value={form.fld_Age} onChange={(e) => set("fld_Age", e.target.value)} /></div>
                <div>
                  <label className={labelCls}>Sex</label>
                  <select className={inputCls} value={form.fld_Sex} onChange={(e) => set("fld_Sex", e.target.value)}>
                    <option value="">— Select —</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div><label className={labelCls}>Religion</label><input className={inputCls} value={form.fld_Religion} onChange={(e) => set("fld_Religion", e.target.value)} /></div>
                <div><label className={labelCls}>Citizenship</label><input className={inputCls} value={form.fld_Citizenship} onChange={(e) => set("fld_Citizenship", e.target.value)} /></div>
              </div>
              <div>
                <label className={labelCls}>Civil Status</label>
                <div className="flex gap-4 mt-1">
                  {["Single", "Married", "Widowed"].map((s) => (
                    <label key={s} className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                      <input type="radio" name="civil_status" value={s} checked={form.fld_CivilStatus === s} onChange={() => set("fld_CivilStatus", s)} />
                      {s}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </fieldset>

          {/* Background */}
          <fieldset className={fieldsetCls}>
            <legend className={legendCls}>Background</legend>
            <div className="mt-2 space-y-3">
              <div><label className={labelCls}>Occupation</label><input className={inputCls} value={form.fld_Occupation} onChange={(e) => set("fld_Occupation", e.target.value)} /></div>
              <div><label className={labelCls}>Address & Barangay</label><input className={inputCls} value={form.fld_Address} onChange={(e) => set("fld_Address", e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelCls}>Name of Father</label><input className={inputCls} value={form.fld_FatherName} onChange={(e) => set("fld_FatherName", e.target.value)} /></div>
                <div><label className={labelCls}>Name of Mother (Maiden)</label><input className={inputCls} value={form.fld_MotherName} onChange={(e) => set("fld_MotherName", e.target.value)} /></div>
              </div>
              <div><label className={labelCls}>Address and Place of Cemetery</label><input className={inputCls} value={form.fld_Cemetery} onChange={(e) => set("fld_Cemetery", e.target.value)} /></div>
            </div>
          </fieldset>

          {/* Informant */}
          <fieldset className={fieldsetCls}>
            <legend className={legendCls}>Informant Details</legend>
            <div className="mt-2 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelCls}>Informant</label><input className={inputCls} value={form.fld_Informant} onChange={(e) => set("fld_Informant", e.target.value)} required /></div>
                <div><label className={labelCls}>Relationship to Deceased</label><input className={inputCls} value={form.fld_Relationship} onChange={(e) => set("fld_Relationship", e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelCls}>Address</label><input className={inputCls} value={form.fld_InformantAddress} onChange={(e) => set("fld_InformantAddress", e.target.value)} /></div>
                <div><label className={labelCls}>Contact No.</label><input type="tel" className={inputCls} value={form.fld_ContactNumber} onChange={(e) => set("fld_ContactNumber", e.target.value)} /></div>
              </div>
            </div>
          </fieldset>

          {/* Package */}
          <fieldset className={fieldsetCls}>
            <legend className={legendCls}>Package</legend>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <div><label className={labelCls}>Package</label><input className={inputCls} value={form.fld_Package} readOnly /></div>
              <div><label className={labelCls}>Price</label><input className={inputCls} value={form.fld_PackagePrice} readOnly /></div>
            </div>
          </fieldset>

          {/* Body Pickup */}
          <fieldset className={fieldsetCls}>
            <legend className={legendCls}>Body Pickup</legend>
            <div className="mt-2">
              <label className={labelCls}>Address Where Body Will Be Picked Up</label>
              <input className={inputCls} value={form.fld_PickupAddress} onChange={(e) => set("fld_PickupAddress", e.target.value)} placeholder="Street, Barangay, City, Province" />
            </div>
          </fieldset>

          {/* Obituary Photo */}
          <fieldset className={fieldsetCls}>
            <legend className={legendCls}>Obituary Photo</legend>
            <div className="mt-2">
              <label className={labelCls}>Photo for Obituary <span className="font-normal text-gray-400">(JPG or PNG — max 5MB)</span></label>
              {obituaryPreview && !obituaryFile && (
                <img src={obituaryPreview} alt="Current obituary" className="mb-2 h-40 w-full rounded-lg object-contain border border-gray-200 dark:border-gray-700"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              )}
              <label className="mt-1 flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-4 py-6 text-sm text-gray-400 hover:border-brand-400 dark:border-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <span>{obituaryLabel}</span>
                <input type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) { setObituaryFile(f); setObituaryLabel(f.name); setObituaryPreview(URL.createObjectURL(f)); }
                }} />
              </label>
            </div>
          </fieldset>

          {/* Payment */}
          <fieldset className={fieldsetCls}>
            <legend className={legendCls}>Payment Receipt</legend>
            <div className="mt-2">
              <label className={labelCls}>Attach Receipt <span className="font-normal text-gray-400">(JPG, PNG or PDF — max 5MB)</span></label>
              {paymentPreview && !paymentFile && (
                <img src={paymentPreview} alt="Current receipt" className="mb-2 h-40 w-full rounded-lg object-contain border border-gray-200 dark:border-gray-700"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              )}
              <label className="mt-1 flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-4 py-6 text-sm text-gray-400 hover:border-brand-400 dark:border-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <span>{paymentLabel}</span>
                <input type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden" onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) { setPaymentFile(f); setPaymentLabel(f.name); setPaymentPreview(URL.createObjectURL(f)); }
                }} />
              </label>
            </div>
          </fieldset>

          {/* Status */}
          <fieldset className={fieldsetCls}>
            <legend className={legendCls}>Transaction Status</legend>
            <div className="mt-2">
              <select className={inputCls} value={form.fld_TransactionStatus} onChange={(e) => set("fld_TransactionStatus", e.target.value)}>
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </fieldset>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-60">
              {saving ? "Saving…" : "Update Registration"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



const TransactionTable: React.FC<TransactionTableProps> = ({ refreshKey }) => {
  const [tableData, setTableData] = useState<DeceasedTransaction[]>([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // modal state
  const [modalRow, setModalRow]     = useState<DeceasedTransaction | null>(null);
  const [updateRow, setUpdateRow]   = useState<DeceasedTransaction | null>(null);

  const fetchTableData = async () => {
    try {
      const req = new FetchAPIData();
      const response = await req.requestWOParam("/deceased/all");
      if (response.status === "success") {
        setTableData(response.data);
      } else {
        console.error("Failed to fetch transaction data:", response.message);
      }
    } catch (error) {
      console.error("Error fetching transaction data:", error);
    }
  };

  useEffect(() => {
    fetchTableData();
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  const paginatedData = tableData.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const totalPages = Math.ceil(tableData.length / rowsPerPage);

  function statusColor(status: string): "success" | "warning" | "error" | "info" {
    switch (status) {
      case "APPROVED":      return "success";
      case "PARTIALY PAID": return "warning";
      case "PENDING":       return "warning";
      case "UNPAID":        return "info";
      default:              return "error";
    }
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[900px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Transaction #</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Deceased Name</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Date of Death</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Burial Date</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Package</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Package Price</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Payment</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Status</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Action</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {paginatedData.map((row) => (
                  <TableRow key={row.fld_DeceasedId}>
                    <TableCell className="px-5 py-3 text-gray-500 text-theme-sm dark:text-gray-400">{row.fld_TransactionNumber}</TableCell>
                    <TableCell className="px-5 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {`${row.fld_FirstName} ${row.fld_MiddleName ? row.fld_MiddleName + " " : ""}${row.fld_LastName}`}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-gray-500 text-theme-sm dark:text-gray-400">{row.fld_DateOfDeath}</TableCell>
                    <TableCell className="px-5 py-3 text-gray-500 text-theme-sm dark:text-gray-400">{row.fld_BurialDate}</TableCell>
                    <TableCell className="px-5 py-3 text-gray-500 text-theme-sm dark:text-gray-400">{row.fld_Package}</TableCell>
                    <TableCell className="px-5 py-3 text-gray-500 text-theme-sm dark:text-gray-400">₱{row.fld_PackagePrice}</TableCell>
                    <TableCell className="px-5 py-3 text-theme-sm">
                      {row.fld_Payment ? (
                        <button
                          onClick={() => setModalRow(row)}
                          className="truncate max-w-[140px] text-brand-500 underline hover:text-brand-600 dark:text-brand-400 text-left"
                          title={row.fld_Payment}
                        >
                          View Payment Receipt
                        </button>
                      ) : (
                        <span className="text-gray-400 text-theme-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-theme-sm">
                      <Badge size="sm" color={statusColor(row.fld_TransactionStatus)}>
                        {row.fld_TransactionStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-5 py-3 text-theme-sm">
                      {row.fld_TransactionStatus !== "APPROVED" && (
                        <button
                          className="rounded bg-blue-500 px-3 py-1.5 text-xs text-white hover:bg-blue-600"
                          onClick={() => setUpdateRow(row)}
                        >
                          Update
                        </button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex items-center justify-center gap-2 py-4">
              <Button variant="outlined" size="small" disabled={page === 1} onClick={() => setPage(page - 1)}>
                Previous
              </Button>
              <span className="text-sm text-gray-500">Page {page} of {totalPages || 1}</span>
              <Button variant="outlined" size="small" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment receipt modal */}
      {modalRow && (
        <PaymentModal
          filename={modalRow.fld_Payment}
          deceasedId={modalRow.fld_DeceasedId}
          onClose={() => setModalRow(null)}
        />
      )}

      {/* Update deceased modal */}
      {updateRow && (
        <UpdateDeceasedModal
          row={updateRow}
          onClose={() => setUpdateRow(null)}
          onSaved={fetchTableData}
        />
      )}
    </>
  );
};

export default function BasicTableOne() {
  return (
    <div>
      <ComponentCard title="Transaction Table">
        <TransactionTable refreshKey={0} />
      </ComponentCard>
    </div>
  );
}

