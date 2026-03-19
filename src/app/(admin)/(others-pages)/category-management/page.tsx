import CategoryManagement from "@/components/category-management/CategoryManagement";
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
      <PageBreadcrumb pageTitle="Category Management" />
      <CategoryManagement />
    </div>
  );
}
