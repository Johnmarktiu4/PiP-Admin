import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import InventoryTable from "@/components/inventory/InventoryList";
import Button from "@/components/ui/button/Button";
import { BoxIcon } from "@/icons";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Mr. Snow Admin",
  description:
    "",
  // other metadata
};

export default function Inventory() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Inventory" />
      <div className="space-y-6">
        <ComponentCard title="Inventory Table">
            <div className="flex items-right gap-5">
            <Button size="sm" variant="outline" startIcon={<BoxIcon />}>
              Stock Management
            </Button>
            </div>
          <InventoryTable />
        </ComponentCard>
      </div>
    </div>
  );
}
