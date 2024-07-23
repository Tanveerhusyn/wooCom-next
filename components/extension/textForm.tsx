import React, { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FancyMultipleSelect from "./fancy-multiple-select";
import {
  getAllProductCategories,
  updateProduct,
  updateProductCategory,
  updateProductExtras,
  updateSeoFields,
} from "@/lib/queries";
import toast from "react-hot-toast";

export default function ImprovedProductForm({
  product,
  user,
  sessionUser,
  markTabAsEdited,
}) {
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
  const [selectedCat, setSelectedCat] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [fit, setFit] = useState("");
  const [style, setStyle] = useState("");
  const [materialCare, setMaterialCare] = useState("");
  const [gender, setGender] = useState("");
  const [collection, setCollection] = useState("");

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
      markTabAsEdited("text");
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

      const updateSeoFieldsResponse = await updateSeoFields(
        product.id,
        seoTitle,
        metaDesc,
      );

      if (
        updateProductResponse &&
        updateSeoFieldsResponse &&
        updateProductCategoriesResponse &&
        updateProductExtrasResponse
      ) {
        toast.success("All changes saved successfully.");
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

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        ["link", "image"],
        ["clean"],
      ],
    }),
    [],
  );

  const quillStyle = {
    height: "400px", // Set a fixed height
    marginBottom: "20px",
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  return (
    <div className="container w-full min-w-[80vw] mx-[0px] h-[650px] py-2">
      <Card className="flex flex-col md:flex-row h-full min-h-[500px]">
        <Tabs
          defaultValue="basic-info"
          className="flex flex-col md:flex-row w-full"
        >
          <div className="md:w-1/4 border-r">
            <CardHeader>
              <CardTitle>Edit Product</CardTitle>
              <CardDescription>
                Update product details, SEO information, and more.
              </CardDescription>
            </CardHeader>
            <TabsList className="flex flex-col justify-between bg-transparent h-[70%] space-y-2">
              <div className="w-[90%]">
                <TabsTrigger
                  value="basic-info"
                  className="w-full justify-start data-[state=active]:bg-white data-[state=active]:text-black"
                >
                  Basic Info
                </TabsTrigger>
                <TabsTrigger
                  value="details"
                  className="w-full justify-start data-[state=active]:bg-white data-[state=active]:text-black"
                >
                  Details
                </TabsTrigger>
                <TabsTrigger
                  value="seo"
                  className="w-full justify-start data-[state=active]:bg-white data-[state=active]:text-black"
                >
                  SEO
                </TabsTrigger>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveChanges} disabled={loading}>
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  Save All Changes
                </Button>
              </div>
            </TabsList>
          </div>
          <div className="md:w-3/4">
            <CardContent className="pt-6">
              <TabsContent value="basic-info">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">{productTitle}</h2>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="product-title">Product Title</Label>
                      <Input
                        id="product-title"
                        value={productTitle}
                        onChange={(e) => {
                          markTabAsEdited("text");

                          setProductTitle(e.target.value);
                        }}
                        placeholder="Product Title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="product-category">Product Category</Label>
                      <Select
                        id="product-category"
                        onValueChange={(value) => {
                          markTabAsEdited("text");

                          setSelectedCat(value);
                        }}
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
                    <Label htmlFor="product-description">
                      Product Description
                    </Label>
                    <div className="quill-editor" style={quillStyle}>
                      <ReactQuill
                        theme="snow"
                        value={productDescription}
                        onChange={setProductDescription}
                        modules={modules}
                        formats={formats}
                        style={{ height: "100%" }}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="details">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Product Details</h2>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fit">Fit</Label>
                      <Input
                        id="fit"
                        value={fit}
                        onChange={(e) => {
                          markTabAsEdited("text");

                          setFit(e.target.value);
                        }}
                        placeholder="Fit"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="style">Style</Label>
                      <Input
                        id="style"
                        value={style}
                        onChange={(e) => {
                          markTabAsEdited("text");

                          setStyle(e.target.value);
                        }}
                        placeholder="Style"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="material-care">Material & Care</Label>
                      <Input
                        id="material-care"
                        value={materialCare}
                        onChange={(e) => {
                          markTabAsEdited("text");

                          setMaterialCare(e.target.value);
                        }}
                        placeholder="Material & Care"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fit">Gender</Label>
                      <Input
                        id="fit"
                        value={gender}
                        onChange={(e) => {
                          markTabAsEdited("text");

                          setGender(e.target.value);
                        }}
                        placeholder="Gender"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="style">Collection</Label>
                      <Input
                        id="style"
                        value={collection}
                        onChange={(e) => {
                          markTabAsEdited("text");

                          setCollection(e.target.value);
                        }}
                        placeholder="Collection"
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
                </div>
              </TabsContent>
              <TabsContent value="seo">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">SEO Information</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="yoast-seo-title">SEO Title</Label>
                      <Input
                        id="yoast-seo-title"
                        value={seoTitle}
                        onChange={(e) => {
                          markTabAsEdited("text");

                          setSeoTitle(e.target.value);
                        }}
                        placeholder="SEO Title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="yoast-seo-slug">SEO Slug</Label>
                      <Input
                        id="yoast-seo-slug"
                        value={slug}
                        onChange={(e) => {
                          markTabAsEdited("text");

                          setSlug(e.target.value);
                        }}
                        placeholder="SEO Slug"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="yoast-meta-description">
                      Meta Description
                    </Label>

                    <div className="quill-editor" style={quillStyle}>
                      <ReactQuill
                        theme="snow"
                        value={metaDesc}
                        onChange={setMetaDesc}
                        modules={modules}
                        formats={formats}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </div>
        </Tabs>
      </Card>
    </div>
  );
}
