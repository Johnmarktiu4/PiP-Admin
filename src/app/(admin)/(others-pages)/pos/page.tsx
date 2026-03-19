import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import { Metadata } from "next";
import React from "react";
import PointOfSale from "@/components/pos/PointOfSale";
import DefaultInputs from "@/components/form/form-elements/DefaultInputs";

export const metadata: Metadata = {
  title: "Mr. Snow Admin",
  description:
    "",
  // other metadata
};

export default function POS() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-12">
        <PageBreadcrumb pageTitle="Menu" />
        <div className="space-y-6">
          <ComponentCard title="POS Menu">
            <PointOfSale />
          </ComponentCard>
        </div>
      </div>

     
    </div>
  );
}

// pages/index.js
// "use client";
// import StatsCards from "@/components/common/StatsCard";
// import CategoryTabs from "@/components/common/CategoryTabs";
// import ProductGrid from "@/components/common/ProductGrid";
// import { useState } from 'react';

// export default function Home() {
//   const [selectedCategory, setSelectedCategory] = useState('Grocery');

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <StatsCards />
//       <CategoryTabs selected={selectedCategory} onSelect={setSelectedCategory} />
//       <ProductGrid />
//     </div>
//   );
// }
