"use client";
import React, { useState, useEffect } from "react";
import { Label } from "../ui/label";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "../ui/select";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea"; // Assuming you have a Textarea component in your UI library
import FancyMultipleSelect from "./fancy-multiple-select";
import { updateProduct, updateSeoFields } from "@/lib/queries";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";

export default function TextForm({ product }) {
  console.log(product);
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [slug, setSlug] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [productTitle, setProductTitle] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const { data } = useSession();

  useEffect(() => {
    // Fetch tags and categories from WooCommerce backend
    // Example fetch functions
    async function fetchTags() {
      // Replace with actual fetch call
    }
    async function fetchCategories() {}
    fetchTags();
    fetchCategories();
    console.log(product.productCategories.nodes);
    setCategories(product.productCategories.nodes);
    setTags(product.productTags.nodes);
    setSlug(product.slug);
    setMetaDesc(product.seo.metaDesc);
    setSeoTitle(product.seo.title);
    setProductDescription(product.description);
    setProductTitle(product.name);
  }, [product]);

  const handleSaveChanges = async () => {
    try {
      console.log("USER", data.user);
      if (!data.user) {
        toast.error("You need to be logged in to save changes.");
        return;
      }
      const updateProductResponse = await updateProduct(
        product.id,
        productTitle,
        productDescription,
        slug,
        data.user.accessToken,
      );

      const updateSeoFieldsResponse = await updateSeoFields(
        product.id,
        seoTitle,
        metaDesc,
      );

      if (updateProductResponse && updateSeoFieldsResponse) {
        toast.success("Changes saved successfully.");
      }

      // Add any additional logic after the API calls here
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="bg-white/10 rounded-lg flex justify-center items-center p-4">
      <div className="grid grid-cols-2 gap-4 max-w-lg w-full max-w-[1500px] p-4 bg-black">
        <div className="space-y-2 col-span-2">
          <Label htmlFor="product-title">Product Title</Label>
          <Input
            id="product-title"
            value={productTitle}
            onChange={(e) => setProductTitle(e.target.value)}
            placeholder="Product Title"
          />
        </div>
        <div className="space-y-2 col-span-2">
          <Label htmlFor="product-description">Product Description</Label>
          <Textarea
            id="product-description"
            rows={10}
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            placeholder="Product Description"
          />
        </div>
        <div className="space-y-2 col-span-2">
          <Label htmlFor="product-tags">Product Tags</Label>
          <FancyMultipleSelect tags={product.productTags.nodes} />
        </div>
        <div className="space-y-2 col-span-2">
          <Label htmlFor="product-category">Product Category</Label>
          <Select
            id="product-category"
            onValueChange={(value) => setCategories(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 col-span-2">
          <Label htmlFor="yoast-seo-title">Yoast SEO Title</Label>
          <Input
            id="yoast-seo-title"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            placeholder="Yoast SEO Title"
          />
        </div>
        <div className="space-y-2 col-span-2">
          <Label htmlFor="yoast-seo-slug">Yoast SEO Slug</Label>
          <Input
            id="yoast-seo-slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="Yoast SEO Slug"
          />
        </div>
        <div className="space-y-2 col-span-2">
          <Label htmlFor="yoast-meta-description">Yoast Meta Description</Label>
          <Textarea
            id="yoast-meta-description"
            value={metaDesc}
            onChange={(e) => setMetaDesc(e.target.value)}
            placeholder="Yoast Meta Description"
          />
        </div>
        <div className="space-y-2 col-span-2">
          <Button variant="default" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
