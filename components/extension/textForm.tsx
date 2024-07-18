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
import { Textarea } from "../ui/textarea";
import FancyMultipleSelect from "./fancy-multiple-select";
import {
  getAllProductCategories,
  updateProduct,
  updateProductCategory,
  updateProductExtras,
  updateSeoFields,
} from "@/lib/queries";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

export default function TextForm({ product, user, sessionUser }) {
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [slug, setSlug] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [parsedUser, setParsedUser] = useState({
    accessToken: "",
    email: "",
    id: "",
    name: "",
  });
  const [productTitle, setProductTitle] = useState("");
  const [selectedCat, setSelectedCat] = useState();
  const [productDescription, setProductDescription] = useState("");
  const [fit, setFit] = useState("");
  const [style, setStyle] = useState("");
  const [materialCare, setMaterialCare] = useState("");
  const { data } = useSession();

  useEffect(() => {
    const fetchCat = async (token) => {
      const result = await getAllProductCategories(token);
      setCategories(result);
    };
    setTags(product.productTags.nodes);
    setSlug(product.slug);
    setMetaDesc(product.seo.metaDesc);
    setSeoTitle(product.seo.title);
    setProductDescription(product.description);
    setProductTitle(product.name);
    setFit(product.extras.fit || "");
    setStyle(product.extras.style || "");
    setMaterialCare(product.extras.materialcare || "");
    const parsedValue = sessionUser ? sessionUser : {};

    if (parsedValue.user && parsedValue.user.accessToken) {
      fetchCat(parsedValue.user.accessToken);
    }
    setSelectedCat(product.productCategories.nodes[0]?.id);
    setParsedUser(parsedValue.user);
  }, [product, sessionUser]);

  function decodeBase64Id(encodedString) {
    const decodedString = atob(encodedString);
    const parts = decodedString.split(":");
    return parts[1];
  }

  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      if (!data.user) {
        toast.error("You need to be logged in to save changes.");
        return;
      }
      const updateProductResponse = await updateProduct(
        product.id,
        productTitle,
        productDescription,
        slug,
        parsedUser.accessToken,
        { append: false, nodes: selectedTags.length > 0 ? selectedTags : tags },
      );

      const decodedId = decodeBase64Id(product.id);
      const decodedCat = decodeBase64Id(selectedCat);

      const updateProductCategoriesResponse = await updateProductCategory(
        decodedId,
        decodedCat,
        parsedUser.accessToken,
      );

      const updateProductExtrasResponse = await updateProductExtras(
        product.id,
        fit,
        style,
        materialCare,
        parsedUser.accessToken,
      );

      console.log("updateProductExtrasResponse", updateProductExtrasResponse);
      const updateSeoFieldsResponse = await updateSeoFields(
        product.id,
        seoTitle,
        metaDesc,
      );

      if (
        updateProductResponse &&
        updateSeoFieldsResponse &&
        updateProductCategoriesResponse
      ) {
        toast.success("Changes saved successfully.");
      } else {
        toast.error("Some changes could not be saved. Please try again.");
      }

      setLoading(false);
    } catch (error) {
      console.error("Error saving changes:", error);
      setLoading(false);
      toast.error("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="bg-black rounded-lg p-6 h-screen">
      <div className=" mx-auto  space-y-8">
        <div className="flex w-full justify-end">
          <Button
            variant="default"
            onClick={handleSaveChanges}
            className="px-8 py-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Save Changes
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="product-title">Product Title</Label>
            <Input
              id="product-title"
              value={productTitle}
              onChange={(e) => setProductTitle(e.target.value)}
              placeholder="Product Title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="product-category">Product Category</Label>
            <Select
              id="product-category"
              onValueChange={(value) => setSelectedCat(value)}
              value={selectedCat}
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="product-description">Product Description</Label>
          <Textarea
            id="product-description"
            rows={5}
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            placeholder="Product Description"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="fit">Fit</Label>
            <Input
              id="fit"
              value={fit}
              onChange={(e) => setFit(e.target.value)}
              placeholder="Fit"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="style">Style</Label>
            <Input
              id="style"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              placeholder="Style"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="material-care">Material & Care</Label>
            <Input
              id="material-care"
              value={materialCare}
              onChange={(e) => setMaterialCare(e.target.value)}
              placeholder="Material & Care"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="product-tags">Product Tags</Label>
          <FancyMultipleSelect
            tags={product.productTags.nodes}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
          />
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold">SEO Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="yoast-seo-title">SEO Title</Label>
              <Input
                id="yoast-seo-title"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="SEO Title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="yoast-seo-slug">SEO Slug</Label>
              <Input
                id="yoast-seo-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="SEO Slug"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="yoast-meta-description">Meta Description</Label>
            <Textarea
              id="yoast-meta-description"
              rows={3}
              value={metaDesc}
              onChange={(e) => setMetaDesc(e.target.value)}
              placeholder="Meta Description"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
