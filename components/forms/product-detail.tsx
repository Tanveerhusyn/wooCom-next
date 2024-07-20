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
import {
  Cloud,
  CreditCard,
  ImageIcon,
  Loader2,
  TagIcon,
  UserPlus,
} from "lucide-react";
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
  });

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
      setState((prev) => ({ ...prev, loading: true }));
      console.log(state);
      const result = await updateProductImage(
        product?.product?.id,
        product?.product?.image?.id,
        state.first,
        data.user.accessToken,
      );
      const galleryImagesSrc = state.galleryImages
        .filter((img) => img.src !== state.first)
        .map((img) => img.src);
      const result2 = await updateGalleryImages(
        product?.product?.id,
        galleryImagesSrc,
        data.user.accessToken,
      );
      const stringifiedImgs = processColorImages(state.colorImages);
      const result3 = await updateProductColorImages(
        product?.product?.id,
        stringifiedImgs,
        data.user.accessToken,
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
                    id: c.images.length,
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
                  id: 0,
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
      setState((prev) => ({ ...prev, attLoading: true }));
      if (!data.user) {
        toast.error("You need to be logged in to save changes.");
        return;
      }
      const selectedColours = Object.values(
        state.replacements.colour ||
          state.replacements.color ||
          state.replacements.pa_colour,
      );
      const selectedSizes = Object.values(
        state.replacements.size || state.replacements.pa_size,
      );
      const updateProductAttributesResponse = await updateProductAttributes(
        product?.product?.id,
        selectedColours,
        selectedSizes,
        data.user.accessToken,
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
    setState((prev) => ({
      ...prev,
      mappings: { ...prev.mappings, [attribute]: value },
    }));
  };

  const handleReplacementChange = (attribute, originalValue, newValue) => {
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

  const productAttributes = product?.product?.attributes?.edges.reduce(
    (acc, { node }) => {
      acc[node.name.toLowerCase()] = node.options;
      return acc;
    },
    {},
  );

  const globalAttributes = {
    colour: product?.globalColors?.nodes.map((node) => node.name),
    size: product?.globalSizes?.nodes.map((node) => node.name),
  };

  const localSizes = product?.product?.attributes?.edges[1]?.node?.options?.map(
    (node, idx) => ({
      name: node,
      id: idx,
    }),
  );

  const handleSaveMetadata = async (imageId) => {
    const metadata = state.imageMetadata[imageId] || {
      imageType: "product",
      gender: "",
      skinColor: "",
    };
    const token = data.user.accessToken;
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
  };

  return (
    <Tabs className="w-full" defaultValue="overview">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="media">Media</TabsTrigger>
        <TabsTrigger value="size">Size</TabsTrigger>
        <TabsTrigger value="text">Text</TabsTrigger>
        <TabsTrigger value="attributes">Attributes</TabsTrigger>
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
                  setFirst={(value) =>
                    setState((prev) => ({ ...prev, first: value }))
                  }
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
                        return (
                          <div
                            key={idx}
                            className="w-full flex flex-col justify-left items-left"
                          >
                            {colorImage?.images.length <= 0 && <h5>{color}</h5>}
                            {colorImage?.images.length > 0 ? (
                              <Gallery
                                isColor={color}
                                images={colorImage.images}
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
                                <DropdownMenuSub>
                                  <DropdownMenuSubTrigger>
                                    <TagIcon className="mr-2 h-4 w-4" />
                                    <span>Image Metadata</span>
                                  </DropdownMenuSubTrigger>
                                  <DropdownMenuSubContent className="w-full p-4 bg-gray-200 text-black">
                                    <div className="space-y-4">
                                      <div>
                                        <Label className="mb-2 block">
                                          Image Type
                                        </Label>
                                        <Select
                                          value={
                                            state.imageMetadata[image.id]
                                              ?.imageType || "product"
                                          }
                                          onValueChange={(value) =>
                                            handleImageTypeChange(image, value)
                                          }
                                        >
                                          <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Type" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="product">
                                              Product
                                            </SelectItem>
                                            <SelectItem value="person">
                                              Person
                                            </SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      {state.imageMetadata[image.id]
                                        ?.imageType === "person" && (
                                        <div>
                                          <div>
                                            <Label
                                              htmlFor="gender"
                                              className="mb-1 block"
                                            >
                                              Gender
                                            </Label>
                                            <Select
                                              value={
                                                state.imageMetadata[image.id]
                                                  ?.gender || ""
                                              }
                                              onValueChange={(value) =>
                                                handleGenderChange(image, value)
                                              }
                                            >
                                              <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Gender" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="male">
                                                  Male
                                                </SelectItem>
                                                <SelectItem value="female">
                                                  Female
                                                </SelectItem>
                                                <SelectItem value="other">
                                                  Other
                                                </SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>
                                          <div>
                                            <Label
                                              htmlFor="skinColor"
                                              className="mb-1 block"
                                            >
                                              Skin Color
                                            </Label>
                                            <Select
                                              value={
                                                state.imageMetadata[image.id]
                                                  ?.skinColor || ""
                                              }
                                              onValueChange={(value) =>
                                                handleSkinColorChange(
                                                  image,
                                                  value,
                                                )
                                              }
                                            >
                                              <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Skin Color" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="light">
                                                  Light
                                                </SelectItem>
                                                <SelectItem value="medium">
                                                  Medium
                                                </SelectItem>
                                                <SelectItem value="dark">
                                                  Dark
                                                </SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>
                                        </div>
                                      )}
                                      <Button
                                        className="bg-black text-white hover:bg-gray-800"
                                        onClick={() =>
                                          handleSaveMetadata(image.id)
                                        }
                                      >
                                        Save Metadata
                                      </Button>
                                    </div>
                                  </DropdownMenuSubContent>
                                </DropdownMenuSub>
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
      <TabsContent value="size" className="py-10 h-[800px] overflow-y-auto">
        <div className="flex justify-between items-start h-full">
          <div className="max-w-[400px]">
            {state.selectedSizeImage ? (
              <Gallery
                first={null}
                setFirst={null}
                isColor={""}
                images={[
                  {
                    id: state.selectedSizeImage?.id,
                    src: state.selectedSizeImage?.source_url,
                  },
                ]}
              />
            ) : (
              <HiPhoto className="w-[30rem] h-[200px] mx-auto my-4" />
            )}
          </div>
          <div className="col-span-2">
            <SpreadSheet
              productId={product?.product?.id}
              product={product?.product}
              globalSizes={localSizes}
              selectedImage={state.selectedSizeImage}
              setSelectedImage={(value) =>
                setState((prev) => ({ ...prev, selectedSizeImage: value }))
              }
              sessionUser={sessionUser}
            />
          </div>
        </div>
      </TabsContent>
      <TabsContent value="text" className="py-10 h-[800px] overflow-y-auto">
        <TextForm
          product={product?.product}
          user={data.user}
          sessionUser={sessionUser}
        />
      </TabsContent>
      <TabsContent value="attributes" className="max-w-[54rem] p-4">
        <div className="p-4 bg-black text-white min-h-screen w-full">
          {product && productAttributes && (
            <Button onClick={handleStoreAttributes} className="text-black mb-4">
              {state.attLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Save Changes"
              )}
            </Button>
          )}
          <div className="max-w-4xl mx-auto">
            {product &&
              productAttributes &&
              Object.entries(productAttributes).map(([attribute, values]) => (
                <div
                  key={attribute}
                  className="mb-8 grid grid-cols-2 gap-4 items-start"
                >
                  <div>
                    <h3 className="text-lg font-semibold mb-2 capitalize text-white">
                      {attribute === "pa_colour"
                        ? "Colour"
                        : attribute === "pa_size"
                        ? "Size"
                        : attribute}
                    </h3>
                    {values.map((value, index) => (
                      <input
                        key={index}
                        type="text"
                        value={value}
                        readOnly
                        className="block w-full p-2 mb-2 bg-black border border-gray-800 rounded text-white"
                      />
                    ))}
                  </div>
                  <div>
                    <Select
                      value={state.mappings[attribute] || ""}
                      onValueChange={(value) =>
                        handleMappingChange(attribute, value)
                      }
                    >
                      <SelectTrigger className="w-full mb-2 bg-black border-gray-800 text-white">
                        <SelectValue
                          placeholder={`Select ${attribute} mapping`}
                        />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-gray-800 text-white">
                        {Object.keys(globalAttributes).map((key) => (
                          <SelectItem
                            key={key}
                            value={key}
                            className="hover:bg-gray-800"
                          >
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {state.mappings[attribute] &&
                      values.map((value, index) => (
                        <Select
                          key={index}
                          value={state.replacements[attribute]?.[value] || ""}
                          onValueChange={(newValue) =>
                            handleReplacementChange(attribute, value, newValue)
                          }
                        >
                          <SelectTrigger className="w-full mt-2 bg-black border-gray-800 text-white">
                            <SelectValue placeholder={`Replace ${value}`} />
                          </SelectTrigger>
                          <SelectContent className="bg-black border-gray-800 text-white">
                            {globalAttributes[state.mappings[attribute]].map(
                              (option) => (
                                <SelectItem
                                  key={option}
                                  value={option}
                                  className="hover:bg-gray-800"
                                >
                                  {option}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
