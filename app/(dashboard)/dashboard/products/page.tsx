"use client";
import { useEffect, useState } from "react";
import BreadCrumb from "@/components/breadcrumb";
import { columns } from "@/components/tables/products-table/columns";
import { ProductTable } from "@/components/tables/products-table/product-table";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Product } from "@/constants/data";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";
import { fetchProducts } from "@/lib/queries";
import { useSession } from "next-auth/react";

const breadcrumbItems = [{ title: "Products", link: "/dashboard/products" }];

type ParamsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

const ProductsPage = ({ searchParams }: ParamsProps) => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(Number(searchParams.page) || 1);
  const [pageLimit, setPageLimit] = useState(Number(searchParams.limit) || 10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      const offset = (page - 1) * pageLimit;
      const country = searchParams.search || null;
      const fetchedProducts = await fetchProducts(10, String(offset));

      setAllProducts(fetchedProducts.products.nodes);
      setTotalUsers(1000); // Assuming total users are 1000 as per the commented code
      setPageCount(Math.ceil(1000 / pageLimit));
      setLoading(false);
    };

    fetchProductData();
  }, [
    page,
    pageLimit,
    searchParams.page,
    searchParams.limit,
    searchParams.search,
  ]);

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

        {!loading && (
          <ProductTable
            searchKey="product"
            pageNo={page}
            columns={columns}
            totalUsers={totalUsers}
            data={allProducts}
            pageCount={pageCount}
          />
        )}
      </div>
    </>
  );
};

export default ProductsPage;
