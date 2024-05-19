import BreadCrumb from "@/components/breadcrumb";
import { columns } from "@/components/tables/products-table/columns";
import { ProductTable } from "@/components/tables/products-table/product-table";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Employee, Product } from "@/constants/data";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";

const breadcrumbItems = [{ title: "Products", link: "/dashboard/products" }];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function page({ searchParams }: paramsProps) {
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const country = searchParams.search || null;
  const offset = (page - 1) * pageLimit;

  const res = await fetch(
    `https://api.slingacademy.com/v1/sample-data/products?offset=${offset}&limit=${pageLimit}` +
      (country ? `&search=${country}` : ""),
  );
  const employeeRes = await res.json();
  const totalUsers = employeeRes.total_products; //1000
  const pageCount = Math.ceil(totalUsers / pageLimit);
  const products: Product[] = employeeRes.products;
  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Products`}
            description="Manage all the products from your WooCommerce store in a single platform"
          />

          <Link
            href={"/dashboard/products"}
            className={cn(buttonVariants({ variant: "default" }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div>
        <Separator />

        <ProductTable
          searchKey="product"
          pageNo={page}
          columns={columns}
          totalUsers={totalUsers}
          data={products}
          pageCount={pageCount}
        />
      </div>
    </>
  );
}
