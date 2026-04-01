import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Porta Vaga Admin",
  description:
    "",
  // other metadata
};

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Transaction List" />
      <div className="space-y-6">
        <ComponentCard title="">
          <BasicTableOne />
        </ComponentCard>
      </div>
    </div>
  );
}
