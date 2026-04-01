import ContentManagement from "@/components/cms/ContentManagement";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Content Management | Porta Vaga Admin",
  description: "Manage client-side website content",
};

export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Content Management" />
      <ContentManagement />
    </div>
  );
}
