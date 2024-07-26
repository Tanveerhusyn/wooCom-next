"use client";
import React, { useState, useEffect } from "react";
import { TabsTrigger, TabsList, TabsContent, Tabs } from "../ui/tabs";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "../ui/card";
import { Button } from "../ui/button";
import Gallery from "@/components/extension/gallery/Gallery";
import SpreadSheet from "@/components/extension/spreadsheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Save, ImageIcon, Loader2, TagIcon, UserPlus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "../ui/scroll-area";
import {
  SelectValue,
  SelectTrigger,
  SelectLabel,
  SelectItem,
  SelectGroup,
  SelectContent,
  Select,
} from "@/components/ui/select";
import {
  Carousel,
  CarouselMainContainer,
  CarouselNext,
  CarouselPrevious,
  SliderMainItem,
  CarouselThumbsContainer,
  SliderThumbItem,
} from "@/components/extension/carousel";
import { useSession } from "next-auth/react";
import { Plus, Trash2 } from "lucide-react";
import { HiPhoto } from "react-icons/hi2";
import { HamburgerMenuIcon, SizeIcon } from "@radix-ui/react-icons";
import { Badge } from "../ui/badge";
import toast from "react-hot-toast";
import ImagePickerModal from "@/components/extension/gallery/ImagePickerModal";

import { Input } from "../ui/input";

import {
  getWordPressMedia,
  triggerImagePoolUpdate,
  updateGalleryImages,
  updateProductAttributes,
  updateProductImage,
  uploadImage,
  addImageToProductPoolByUrl,
  updateProductColorImages,
  updateImageMetadata,
} from "@/lib/queries";

import Sizes from "../extension/sizes";
import TextForm from "../extension/textForm";

export default function ProductDetail({ product, sessionUser }) {
  console.log("MAIN PRODUCT", product);
  const [state, setState] = useState({
    images: [],
    galleryImages: [],
    selectedImage: product?.product?.image?.sourceUrl || null,
    variantImages: [],
    allColors: [],
    selectedSizeImage: null,
    selectOptionOne: "Colour",
    selectOptionTwo: "Size",
    first: "",
    loading: false,
    metaLoading: false,
    attLoading: false,
    files: null,
    colorImages: [],
    formData: {
      name: "",
      category: "",
      price: "",
      title: "",
      body: "",
      color: "",
      size: "",
    },
    existingColours: [],
    newColours: [],
    existingSizes: [],
    newSizes: [],
    imageMetadata: {},
    mappings: {},
    replacements: {},
    editedTabs: {
      overview: false,
      media: false,
      size: false,
      text: false,
      attributes: false,
    },
  });

  useEffect(() => {
    // Initialize mappings based on attribute names
    if (product?.product?.attributes?.edges) {
      const initialMappings = product.product.attributes.edges.reduce(
        (acc, { node }) => {
          const attributeName = node.name.toLowerCase();
          if (attributeName.match(/^(pa_)?colou?r$/)) {
            acc["pa_colour"] = "colour";
          } else {
            const mappingKey = attributeName.startsWith("pa_")
              ? attributeName
              : `pa_${attributeName}`;
            acc[mappingKey] = attributeName.replace("pa_", "");
          }
          return acc;
        },
        {},
      );
      setState((prev) => ({ ...prev, mappings: initialMappings }));
    }
  }, [product]);

  const { data } = useSession();

  useEffect(() => {
    if (product) {
      if (product?.product?.colorImages?.colorImages) {
        const res = parseNestedJson(product?.product?.colorImages.colorImages);
        setState((prev) => ({ ...prev, colorImages: res }));
      }
      if (product?.product?.galleryImages) {
        const gImages = transformImages(product?.product?.galleryImages.nodes);
        setState((prev) => ({
          ...prev,
          galleryImages: [
            {
              id: product?.product?.image?.id,
              src: product?.product?.image?.sourceUrl,
              alt: `Image ${product?.product?.image?.id}`,
              acf: product?.product?.image?.acfImageMetadata || {},
            },
            ...gImages,
          ],
        }));
      } else {
        setState((prev) => ({
          ...prev,
          galleryImages: [
            {
              id: product?.product?.image?.id,
              src: product?.product?.image?.sourceUrl,
              alt: `Image ${product?.product?.image?.id}`,
              acf: product?.product?.image?.acfImageMetadata || {},
            },
          ],
        }));
      }
      if (product?.product.variations) {
        setState((prev) => ({
          ...prev,
          variantImages: product?.product?.variations.nodes,
        }));
      }
      callTriggerImagePoolUpdate(sessionUser.user.accessToken);
    }
  }, [product]);

  useEffect(() => {
    if (state.files?.length > 0) {
      const file = state.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const url = reader.result;
        setState((prev) => ({
          ...prev,
          images: [{ source_url: url }, ...prev.images],
        }));
      };
      reader?.readAsDataURL(file);
    }
  }, [state.files]);

  useEffect(() => {
    const fetchMedia = async () => {
      const media = await getWordPressMedia();
      setState((prev) => ({ ...prev, images: media }));
    };
    fetchMedia();
  }, []);

  const parseNestedJson = (input) => {
    try {
      let parsed = input.slice(1, -1);
      parsed = parsed.replace(/\\"/g, '"').replace(/\\\\/g, "\\");
      return JSON.parse(parsed);
    } catch (error) {
      console.error("Error parsing nested JSON:", error);
      return null;
    }
  };

  const transformImages = (images) =>
    images.map((image, idx) => ({
      id: image.id || idx,
      src: image.sourceUrl,
      alt: `Image ${image.id}`,
      acf: image?.acfImageMetadata || {},
    }));

  const callTriggerImagePoolUpdate = async (token) => {
    try {
      const response = await triggerImagePoolUpdate(
        product?.product?.id,
        token || data.user.accessToken,
      );
      if (response) {
        console.log("Image pool updated successfully");
      }
    } catch (err) {
      toast.error("Error updating image pool");
      console.log("Error updating image pool", err);
    }
  };

  const handleSaveChanges = async () => {
    try {
      markTabAsEdited("media");
      setState((prev) => ({ ...prev, loading: true }));
      console.log(state);
      const result = await updateProductImage(
        product?.product?.id,
        product?.product?.image?.id,
        state.first,
        data.user.accessToken || sessionUser.user.accessToken,
      );
      const galleryImagesSrc = state.galleryImages
        .filter((img) => img.src !== state.first)
        .map((img) => img.src);
      const result2 = await updateGalleryImages(
        product?.product?.id,
        galleryImagesSrc,
        data.user.accessToken || sessionUser.user.accessToken,
      );
      const stringifiedImgs = processColorImages(state.colorImages);
      const result3 = await updateProductColorImages(
        product?.product?.id,
        stringifiedImgs,
        data.user.accessToken || sessionUser.user.accessToken,
      );

      if (result) toast.success("Image updated successfully");
      if (result2) toast.success("Gallery updated successfully");
      if (result3) toast.success("Color Images updated successfully");
      setState((prev) => ({ ...prev, loading: false }));
    } catch (err) {
      toast.error("Error updating image");
      setState((prev) => ({ ...prev, loading: false }));
      console.log("Error updating image", err);
    }
  };

  const processColorImages = (colorImages) => {
    let stringified = JSON.stringify(colorImages);
    stringified = stringified.replace(/"/g, '\\"');
    return `"${stringified}"`;
  };

  const handleImageTypeChange = (image, type) => {
    markTabAsEdited("media");

    setState((prev) => ({
      ...prev,
      imageMetadata: {
        ...prev.imageMetadata,
        [image.id]: {
          ...prev.imageMetadata[image.id],
          imageType: type,
        },
      },
    }));
  };
  const markTabAsEdited = (tabName) => {
    setState((prev) => ({
      ...prev,
      editedTabs: {
        ...prev.editedTabs,
        [tabName]: true,
      },
    }));
  };

  // Handle Gender Change
  const handleGenderChange = (image, gender) => {
    console.log("IMGGG", image);
    setState((prev) => ({
      ...prev,
      imageMetadata: {
        ...prev.imageMetadata,
        [image.id]: {
          ...prev.imageMetadata[image.id],
          gender,
        },
      },
    }));
  };

  // Handle Skin Color Change
  const handleSkinColorChange = (image, skinColor) => {
    setState((prev) => ({
      ...prev,
      imageMetadata: {
        ...prev.imageMetadata,
        [image.id]: {
          ...prev.imageMetadata[image.id],
          skinColor,
        },
      },
    }));
  };
  const handleAddToImagesColor = (color, image) => {
    markTabAsEdited("media");

    setState((prev) => {
      const existingColorImages = prev.colorImages || [];
      const colorExists = existingColorImages.some(
        (c) => c.color.toLowerCase() === color.toLowerCase(),
      );

      if (colorExists) {
        return {
          ...prev,
          colorImages: existingColorImages.map((c) => {
            if (c.color.toLowerCase() === color.toLowerCase()) {
              return {
                ...c,
                images: [
                  ...c.images,
                  {
                    id: image.id,
                    src: image.sourceUrl,
                    alt: `Image ${c.images.length}`,
                  },
                ],
              };
            }
            return c;
          }),
        };
      } else {
        return {
          ...prev,
          colorImages: [
            ...existingColorImages,
            {
              color: color,
              images: [
                {
                  id: image.id,
                  src: image.sourceUrl,
                  alt: `Image 0`,
                },
              ],
            },
          ],
        };
      }
    });
  };

  const handleCustomImageUpload = async (files) => {
    markTabAsEdited("media");

    const result = await uploadImage(files[0], data.user.accessToken);
    if (result) {
      await addImageToProductPoolByUrl(
        product?.product?.id,
        data.user.accessToken,
        result.source_url,
      );
    }
  };

  const handleStoreAttributes = async () => {
    try {
      markTabAsEdited("attributes");
      setState((prev) => ({ ...prev, attLoading: true }));
      if (!data.user) {
        toast.error("You need to be logged in to save changes.");
        return;
      }

      const colours = state.replacements["pa_colour"]
        ? Object.values(state.replacements["pa_colour"])
        : productAttributes["pa_colour"] || [];

      const sizes = state.replacements["pa_size"]
        ? Object.values(state.replacements["pa_size"])
        : productAttributes["pa_size"] || [];

      // Filter out any empty values and ensure all values are strings
      const filteredColours = colours.filter(
        (color) => color && typeof color === "string",
      );
      const filteredSizes = sizes.filter(
        (size) => size && typeof size === "string",
      );

      console.log("Colours to update:", filteredColours);
      console.log("Sizes to update:", filteredSizes);

      const updateProductAttributesResponse = await updateProductAttributes(
        product?.product?.id,
        filteredColours,
        filteredSizes,
        data.user.accessToken || sessionUser.user.accessToken,
      );

      if (updateProductAttributesResponse) {
        toast.success("Attributes updated successfully.");
      } else {
        toast.error("Failed to update attributes.");
      }
      setState((prev) => ({ ...prev, attLoading: false }));
    } catch (error) {
      console.error("Error updating attributes:", error);
      setState((prev) => ({ ...prev, attLoading: false }));
      toast.error("An error occurred. Please try again later.");
    }
  };

  const handleMappingChange = (attribute, value) => {
    markTabAsEdited("attributes");
    setState((prev) => ({
      ...prev,
      mappings: { ...prev.mappings, [attribute]: value },
    }));
  };

  const handleAddToSizes = (image: any) => {
    console.log("size", image);
    markTabAsEdited("media");

    setState((prev) => ({
      ...prev,
      selectedSizeImage: {
        id: 1,
        source_url: image.sourceUrl,
      },
    }));
  };

  const handleReplacementChange = (attribute, originalValue, newValue) => {
    markTabAsEdited("attributes");

    setState((prev) => ({
      ...prev,
      replacements: {
        ...prev.replacements,
        [attribute]: {
          ...prev.replacements[attribute],
          [originalValue]: newValue,
        },
      },
    }));
  };

  const localSizes = product?.product?.attributes?.edges[1]?.node?.options?.map(
    (node, idx) => ({
      name: node,
      id: idx,
    }),
  );

  const handleSaveMetadata = async (imageId) => {
    markTabAsEdited("media");
    setState((prev) => ({ ...prev, metaLoading: true }));
    const metadata = state.imageMetadata[imageId] || {
      imageType: "product",
      gender: "",
      skinColor: "",
    };
    const token = data.user.accessToken || sessionUser.user.accessToken;
    console.log("METADATA", metadata);
    if (metadata) {
      const success = await updateImageMetadata(imageId, metadata, token);

      if (success) {
        toast.success("Image metadata updated successfully");
      } else {
        toast.error("Failed to update image metadata");
      }
    } else {
      toast.error("No metadata found for this image");
    }
    setState((prev) => ({ ...prev, metaLoading: false }));
  };
  const productAttributes = product?.product?.attributes?.edges.reduce(
    (acc, { node }) => {
      const key = node.name.toLowerCase().match(/^(pa_)?colou?r$/)
        ? "pa_colour"
        : node.name.toLowerCase().startsWith("pa_")
        ? node.name.toLowerCase()
        : `pa_${node.name.toLowerCase()}`;
      acc[key] = node.options;
      return acc;
    },
    {},
  );

  const globalAttributes = {
    colour: product?.globalColors?.nodes.map((node) => node.name),
    size: product?.globalSizes?.nodes.map((node) => node.name),
    gender: product?.globalGenders?.nodes.map((node) => node.name),
    collection: product?.globalCollections?.nodes.map((node) => node.name),
  };

  const attributeNames = {
    pa_colour: "Color",
    color: "Color",
    colour: "Color",
    pa_size: "Size",
    pa_gender: "Gender",
    pa_collection: "Collection",
  };

  const EditableTabsTrigger = ({ value, children }) => (
    <TabsTrigger
      value={value}
      className="relative h-[40px] w-full flex justify-between items-center gap-2"
    >
      {children}
      {state.editedTabs[value] && (
        <span
          style={{
            zIndex: 999,
          }}
          className="w-4 h-4 rounded-[50%] bg-red-500"
        ></span>
      )}
      {/* <div className="w-[1px] h-8 bg-gray-500 dark:bg-gray-700" /> */}
    </TabsTrigger>
  );

  return (
    <Tabs className="w-full" defaultValue="overview">
      <TabsList className="grid w-full h-[50px] grid-cols-5">
        <EditableTabsTrigger value="overview">Overview</EditableTabsTrigger>
        <EditableTabsTrigger value="media">Media</EditableTabsTrigger>
        <EditableTabsTrigger value="size">Size</EditableTabsTrigger>
        <EditableTabsTrigger value="text">Text</EditableTabsTrigger>
        <EditableTabsTrigger value="attributes">Attributes</EditableTabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <Card className="flex justify-between items-start p-4">
          <div className="flex flex-col justify-center items-start w-[60%] bg-white/10 shadow-md rounded-lg p-4">
            <CardHeader>
              <CardTitle>{product?.product.name}</CardTitle>
              <CardDescription>
                View and edit the overview details for this item.
              </CardDescription>
            </CardHeader>
            <Carousel className="s-full">
              <CarouselNext className="top-1/3 bg-white text-black -translate-y-1/3" />
              <CarouselPrevious className="top-1/3 bg-white text-black -translate-y-1/3" />
              <CarouselMainContainer className="h-60">
                {Array.from({ length: 5 }).map((_, index) => (
                  <SliderMainItem key={index} className="bg-transparent">
                    <img
                      src={product?.product?.image?.sourceUrl}
                      alt={product?.product.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </SliderMainItem>
                ))}
              </CarouselMainContainer>
              {product?.product.variations && (
                <CarouselThumbsContainer>
                  {product?.product.variations.nodes.map((_, index) => (
                    <SliderThumbItem
                      key={index}
                      index={index}
                      className="bg-transparent"
                    >
                      <div className="outline outline-1 outline-border size-full flex items-center justify-center rounded-xl bg-background">
                        <img
                          src={product?.product?.image?.sourceUrl}
                          alt={product?.product.name}
                          className="w-[100px] h-[80px] object-cover rounded-lg"
                        />
                      </div>
                    </SliderThumbItem>
                  ))}
                </CarouselThumbsContainer>
              )}
            </Carousel>
          </div>
          <CardContent className="grid grid-cols-2 gap-2 h-full w-full space-y-2">
            <dl className="max-w-md text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
              <div className="flex flex-col pb-3">
                <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
                  Product Name
                </dt>
                <dd className="text-lg text-white font-normal">
                  {product?.product?.name}
                </dd>
              </div>
              <div className="flex flex-col py-3">
                <dt className="mb-1 text-white md:text-lg dark:text-white">
                  Description
                </dt>
                <dd
                  className="text-lg text-white font-normal"
                  dangerouslySetInnerHTML={{
                    __html: product?.product?.description,
                  }}
                ></dd>
              </div>
              <div className="flex flex-col pt-3">
                <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
                  Price
                </dt>
                <dd className="text-lg text-white font-normal">
                  {product?.product?.price}
                </dd>
              </div>
              <div className="flex flex-col pt-3">
                <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
                  Category
                </dt>
                <div className="grid grid-cols-2 gap-2">
                  {product?.product?.productCategories.nodes.map((cat, idx) => (
                    <Badge key={idx} className="max-w-[fit-content]">
                      {cat.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </dl>
            <dl className="max-w-md text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
              <div className="flex flex-col pt-3">
                <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
                  Status
                </dt>
                <dd className="text-lg font-normal text-white">
                  {product?.product?.stockStatus}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="media" className="h-[800px] overflow-y-auto">
        <Card className="h-full max-h-[1000px] overflow-auto">
          <CardHeader className="flex flex-row justify-between">
            <div></div>
            <Button onClick={handleSaveChanges}>
              {state.loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </CardHeader>
          <CardContent className="space-y-2 flex flex-col overflow-y-auto">
            <div className="m-2 p-2 flex">
              <div className="flex flex-col gap-2">
                <Gallery
                  isColor={false}
                  images={state.galleryImages}
                  first={state.first}
                  state={state}
                  handleImageTypeChange={handleImageTypeChange}
                  handleGenderChange={handleGenderChange}
                  handleSkinColorChange={handleSkinColorChange}
                  handleSaveMetadata={handleSaveMetadata}
                  handleAddToImagesColor={handleAddToImagesColor}
                  setFirst={(value) =>
                    setState((prev) => ({ ...prev, first: value }))
                  }
                  product={product || {}}
                />
                <div className="relative mx-auto max-w-[54rem] rounded-xl border bg-black from-gray-100 from-0% to-gray-200 to-100% shadow-lg">
                  <div className="sticky top-0 z-[1] bg-white/10 flex min-h-[3rem] flex-wrap items-center gap-1 bg-black overflow-y-hidden border-b px-4 py-2 [&_*]:leading-6">
                    <div>
                      <h5>Size Section</h5>
                    </div>
                  </div>
                  <div className="w-[54rem]">
                    {!state.selectedSizeImage ? (
                      <HiPhoto className="w-[54rem] h-[400px] mx-auto my-4" />
                    ) : (
                      <img
                        src={state.selectedSizeImage.source_url}
                        alt="Selected Image"
                        className="w-auto object-fit h-[400px] mx-auto my-4"
                      />
                    )}
                  </div>
                </div>
                <div className="relative mx-auto max-w-[54rem] rounded-xl border bg-black from-gray-100 from-0% to-gray-200 to-100% shadow-lg">
                  <div className="sticky bg-white/10 top-0 z-[1] flex min-h-[3rem] flex-wrap items-center gap-1 bg-black overflow-y-hidden border-b px-4 py-2 [&_*]:leading-6">
                    <div>
                      <h5>Colors</h5>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 w-[54rem] p-4">
                    {product?.product?.attributes?.edges[0]?.node?.options?.map(
                      (color, idx) => {
                        const colorImage = state.colorImages?.find(
                          (c) => c.color.toLowerCase() === color.toLowerCase(),
                        );
                        console.log("COLOR", colorImage);
                        return (
                          <div
                            key={idx}
                            className="w-full flex flex-col justify-left items-left"
                          >
                            {colorImage?.images.length <= 0 && <h5>{color}</h5>}
                            {colorImage?.images.length > 0 ? (
                              <Gallery
                                isColor={color}
                                state={state}
                                handleImageTypeChange={handleImageTypeChange}
                                handleGenderChange={handleGenderChange}
                                handleSkinColorChange={handleSkinColorChange}
                                handleSaveMetadata={handleSaveMetadata}
                                handleAddToImagesColor={handleAddToImagesColor}
                                images={colorImage.images}
                                product={product || {}}
                              />
                            ) : (
                              <span className="flex flex-col justify-start items-start w-full">
                                <HiPhoto className="h-[200px] w-[200px] my-4" />
                              </span>
                            )}
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <ImagePickerModal onUpload={handleCustomImageUpload} />
                <CardDescription className="m-2 p-2">
                  Choose an Image from the Pool
                </CardDescription>
                <ScrollArea className="max-h-[800px] overflow-y-auto">
                  <div className="m-2 p-2 h-full grid grid-cols-2 md:grid-cols-2 gap-5 my-4">
                    {product?.product?.imagePool?.imagePool?.nodes?.map(
                      (image, index) => (
                        <div key={index} className="relative group">
                          <img
                            onClick={() =>
                              setState((prev) => ({
                                ...prev,
                                selectedImage: image.sourceUrl,
                              }))
                            }
                            className="h-auto min-h-[200px] max-h-[200px] w-[200px] object-cover max-w-full rounded-lg transition-opacity duration-200 ease-in-out cursor-pointer group-hover:opacity-50"
                            src={image.sourceUrl}
                            alt="Gallery image"
                          />
                          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out">
                            <DropdownMenu>
                              <DropdownMenuTrigger
                                className="bg-red-500"
                                asChild
                              >
                                <Button
                                  className="m-2 border border-white bg-transparent hover:bg-white hover:text-black"
                                  variant="outline"
                                >
                                  <HamburgerMenuIcon className="w-6 h-6" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                side="top"
                                className="w-56 shadow-3xl bg-gray-200 text-black"
                              >
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                  <DropdownMenuItem
                                    onClick={() => handleAddToGallery(image)}
                                    className="cursor-pointer"
                                  >
                                    <ImageIcon className="mr-2 h-4 w-4" />
                                    <span>Add to Gallery</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleAddToSizes(image)}
                                    className="cursor-pointer"
                                  >
                                    <SizeIcon className="mr-2 h-4 w-4" />
                                    <span>Add to Sizes</span>
                                  </DropdownMenuItem>
                                </DropdownMenuGroup>

                                <DropdownMenuSeparator />
                                {product?.product?.attributes?.edges[0]?.node
                                  ?.options && (
                                  <DropdownMenuGroup>
                                    <DropdownMenuSub>
                                      <DropdownMenuSubTrigger className="cursor-pointer">
                                        <UserPlus className="mr-2 h-4 w-4 " />
                                        <span className="">Add to Colors</span>
                                      </DropdownMenuSubTrigger>
                                      <DropdownMenuPortal className="">
                                        <DropdownMenuSubContent className="bg-gray-200 text-black">
                                          {product?.product?.attributes?.edges[0]?.node?.options.map(
                                            (color) => (
                                              <React.Fragment key={color}>
                                                <DropdownMenuItem
                                                  onClick={() =>
                                                    handleAddToImagesColor(
                                                      color,
                                                      image,
                                                    )
                                                  }
                                                  className="cursor-pointer"
                                                >
                                                  <Plus className="mr-2 h-4 w-4" />
                                                  <span>{color}</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                              </React.Fragment>
                                            ),
                                          )}
                                        </DropdownMenuSubContent>
                                      </DropdownMenuPortal>
                                    </DropdownMenuSub>
                                  </DropdownMenuGroup>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <div className="absolute cursor-pointer top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Trash2 className="w-6 h-6 text-white hover:text-red-500" />
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you absolutely sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete this picture from the
                                    pool.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction>
                                    Continue
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="size" className="py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Size Chart Image</CardTitle>
            </CardHeader>
            <CardContent>
              {state.selectedSizeImage ? (
                <div className="flex items-center justify-center bg-gray-100 rounded-lg h-64">
                  <img
                    src={state.selectedSizeImage.source_url}
                    alt="Size Chart"
                    className="w-full h-full object-cover cursor-pointer"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center bg-gray-100 rounded-lg h-64">
                  <HiPhoto className="w-24 h-24 text-gray-400" />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Size Information</CardTitle>
            </CardHeader>
            <CardContent className="max-h-[600px] overflow-y-auto">
              <SpreadSheet
                productId={product?.product?.id}
                product={product?.product}
                markTabAsEdited={markTabAsEdited}
                globalSizes={localSizes}
                selectedImage={state.selectedSizeImage}
                setSelectedImage={(value) =>
                  setState((prev) => ({ ...prev, selectedSizeImage: value }))
                }
                sessionUser={sessionUser}
              />
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      <TabsContent value="text" className="py-10 h-[800px] overflow-y-auto">
        <TextForm
          product={product?.product}
          user={data.user}
          markTabAsEdited={markTabAsEdited}
          sessionUser={sessionUser}
        />
      </TabsContent>
      <TabsContent value="attributes" className="w-full p-4">
        <div className="flex flex-col space-y-6 p-6 bg-black min-h-screen">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white dark:text-white">
              Product Attributes
            </h2>
            <Button
              onClick={handleStoreAttributes}
              className="bg-white hover:bg-white/10 text-black"
            >
              {state.attLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>

          {product && productAttributes && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(productAttributes).map(([attribute, values]) => (
                <Card key={attribute}>
                  <CardHeader>
                    <CardTitle>
                      {attributeNames[attribute] ||
                        attribute.replace("pa_", "").charAt(0).toUpperCase() +
                          attribute.replace("pa_", "").slice(1)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Select
                      value={state.mappings[attribute] || ""}
                      onValueChange={(value) =>
                        handleMappingChange(attribute, value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={`Select ${attribute.replace(
                            "pa_",
                            "",
                          )} mapping`}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(globalAttributes).map((key) => (
                          <SelectItem key={key} value={key}>
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {values.map((value, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          type="text"
                          value={value}
                          readOnly
                          className="flex-1"
                        />
                        <Select
                          value={state.replacements[attribute]?.[value] || ""}
                          onValueChange={(newValue) =>
                            handleReplacementChange(attribute, value, newValue)
                          }
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder={`Replace ${value}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {globalAttributes[state.mappings[attribute]]?.map(
                              (option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
