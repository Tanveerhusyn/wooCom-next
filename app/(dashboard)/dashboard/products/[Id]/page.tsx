"use client";

import BreadCrumb from "@/components/breadcrumb";
import { ProductForm } from "@/components/forms/product-form";
import ProductDetail from "@/components/forms/product-detail";
import React, { useEffect, useState } from "react";
import { fetchProductById } from "@/lib/queries";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { useSession } from "next-auth/react";

export default function Page({ params }) {
  const { data } = useSession();
  const [product, setProduct] = React.useState(null);

  const breadcrumbItems = [
    { title: "Products", link: "/dashboard/products" },
    { title: "Edit", link: `/dashboard/employee/${params.Id}` },
  ];

  //Trigger this endpoint http://localhost:3000/dashboard/products/params.Id

  useEffect(() => {
    if (params.Id) {
      const fetchData = async () => {
        const productData = await fetchProductById(params.Id);
        console.log(productData);
        setProduct(productData);
      };
      fetchData();
    }
  }, [params.Id]);

  // const res = await fetch(
  //   `https://api.slingacademy.com/v1/sample-data/products/${params.Id}`,
  // );

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
      <ProductDetail product={product} sessionUser={data} />
    </div>
  );
}
