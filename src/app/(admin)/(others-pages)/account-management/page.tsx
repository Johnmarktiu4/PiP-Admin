import CategoryManagement from "@/components/category-management/CategoryManagement";
import AccountManagement from "@/components/account-management/AccountManagement";
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
      <PageBreadcrumb pageTitle="Account Management" />
      <AccountManagement />
    </div>
  );
}
