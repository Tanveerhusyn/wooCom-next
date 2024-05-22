import BreadCrumb from "@/components/breadcrumb";
import { ProductForm } from "@/components/forms/product-form";
import ProductDetail from "@/components/forms/product-detail";
import React from "react";
import { fetchProductById } from "@/lib/queries";

export default async function Page({ params }) {
  console.log("searchParams", params);

  const breadcrumbItems = [
    { title: "Products", link: "/dashboard/products" },
    { title: "Edit", link: `/dashboard/employee/${params.Id}` },
  ];

  //Trigger this endpoint http://localhost:3000/dashboard/products/params.Id

  const product = await fetchProductById(decodeURIComponent(params.Id));

  // const res = await fetch(
  //   `https://api.slingacademy.com/v1/sample-data/products/${params.Id}`,
  // );
  // const product = await res.json();
  console.log("single product", product);
  return (
    <div className="flex-1 space-y-4 p-8">
      <BreadCrumb items={breadcrumbItems} />
      {/* <ProductForm
        categories={[
          { _id: "shirts", name: "shirts" },
          { _id: "pants", name: "pants" },
        ]}
        initialData={null}
        key={null}
      /> */}
      <ProductDetail product={product} />
    </div>
  );
}
