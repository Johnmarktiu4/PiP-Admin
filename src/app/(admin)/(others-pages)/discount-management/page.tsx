import DiscountManagement from "@/components/discount-management/DiscountManagement";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Mr. Snow Admin",
  description:
    "",
  // other metadata
};
export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Discount Management" />
      <DiscountManagement />
    </div>
  );
}
