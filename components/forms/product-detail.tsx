"use client";
import React, { useState } from "react";
import { TabsTrigger, TabsList, TabsContent, Tabs } from "../ui/tabs";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Product, ProductData } from "@/types";
import FileUploader from "@/components/forms/file-uploader";
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
  DropdownMenuShortcut,
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
  User,
  UserPlus,
  Users,
} from "lucide-react";
import {
  Carousel,
  CarouselMainContainer,
  CarouselNext,
  CarouselPrevious,
  SliderMainItem,
  CarouselThumbsContainer,
  SliderThumbItem,
} from "@/components/extension/carousel";
import Sizes from "../extension/sizes";
import TextForm from "../extension/textForm";
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
  getWordPressMedia,
  updateGalleryImages,
  updateProductAttributes,
  updateProductImage,
  uploadImage,
} from "@/lib/queries";
import { useSession } from "next-auth/react";
import { Plus, Trash, Trash2 } from "lucide-react";
import { HiPhoto } from "react-icons/hi2";
import { HamburgerMenuIcon, SizeIcon } from "@radix-ui/react-icons";
import { Badge } from "../ui/badge";
import toast from "react-hot-toast";

export default function ProductDetail({
  product,
  sessionUser,
}: {
  product: any;
  sessionUser: any;
}) {
  const [images, setImages] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(
    product?.product?.image?.sourceUrl || null,
  );
  const [variantImages, setVariantImages] = useState([]);
  const [allColors, setAllColors] = useState([]);
  const [selectedSizeImage, setSelectedSizeImage] = useState(null);
  const [selectOptionOne, setSelectOptionOne] = useState("Colour");
  const [selectOptionTwo, setSelectOptionTwo] = useState("Size");
  const [first, setFirst] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [attLoading, setAttLoading] = useState<boolean>(false);
  const [files, setFiles] = useState<File[] | null>(null);
  const [colorImages, setColorImages] = useState([
    {
      color: "",
      images: [],
    },
  ]);
  // "Collection", "Gender",
  const options = ["Colour", "Size"];

  const filteredOptionsOne = options.filter(
    (option) => option !== selectOptionTwo,
  );

  const { data } = useSession();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    title: "",
    body: "",
    color: "",
    size: "",
  });

  React.useEffect(() => {
    if (product) {
      if (product?.product?.galleryImages) {
        const gImages = transformImages(product?.product?.galleryImages.nodes);
        console.log("MEDIA", gImages);
        setGalleryImages([
          {
            id: product?.product?.image?.id,
            src: product?.product?.image?.sourceUrl,
            alt: `Image ${product?.product?.image?.id}`,
          },
          ...gImages,
        ]);
      } else {
        setGalleryImages([
          {
            id: product?.product?.image?.id,
            src: product?.product?.image?.sourceUrl,
            alt: `Image ${product?.product?.image?.id}`,
          },
        ]);
      }

      if (product?.product.variations) {
        setVariantImages(product?.product?.variations.nodes);
      }

      if (product?.product.allPaColour) {
        setAllColors(product?.product?.allPaColour.nodes);
        setColorImages(
          product?.product?.allPaColour.nodes.map((color) => ({
            color: color.name,
            images: [],
          })),
        );
      }
    }
  }, [product]);

  React.useEffect(() => {
    if (files?.length > 0) {
      console.log("FILES", files);
      //add the image file to the images useState by first converting the File object to a URL
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const url = reader.result;
        setImages((prevImages) => [{ source_url: url }, ...prevImages]);
      };
      reader?.readAsDataURL(file);
    }
  }, [files]);

  const transformImages = (images) => {
    return images.map((image, idx) => ({
      id: image.id || idx,
      src: image.sourceUrl,
      alt: `Image ${image.id}`, // Provide a meaningful alt text, if available
      // Add any other properties you need
    }));
  };

  const getExistingValues = (option: string) => {
    switch (option) {
      // case "Collection":
      //   return (
      //     product?.product?.allPaCollection?.nodes.map((item) => item.name) ||
      //     []
      //   );
      // case "Gender":
      //   return (
      //     product?.product?.allPaGender?.nodes.map((item) => item.name) || []
      //   );
      case "Colour":
        return (
          product?.product?.allPaColour?.nodes.map((item) => item.name) || []
        );
      case "Size":
        return (
          product?.product?.allPaSize?.nodes.map((item) => item.name) || []
        );
      default:
        return [];
    }
  };

  const renderSelectContent = (option: string) => {
    switch (option) {
      case "Collection":
        return product.globalCollections.nodes.map((item, idx) => (
          <SelectItem key={idx} value={item.name}>
            {item.name}
          </SelectItem>
        ));
      case "Gender":
        return product.globalGenders.nodes.map((item, idx) => (
          <SelectItem key={idx} value={item.name}>
            {item.name}
          </SelectItem>
        ));
      case "Colour":
        return product.globalColors.nodes.map((item, idx) => (
          <SelectItem key={idx} value={item.name}>
            {item.name}
          </SelectItem>
        ));
      case "Size":
        return product.globalSizes.nodes.map((item, idx) => (
          <SelectItem key={idx} value={item.name}>
            {item.name}
          </SelectItem>
        ));
      default:
        return null;
    }
  };
  React.useEffect(() => {
    const fetchMedia = async () => {
      const media = await getWordPressMedia();
      setImages(media);
    };

    fetchMedia();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [id]: value }));
  };

  const handleAddToSizes = (image: any) => {
    setSelectedSizeImage(image);
  };

  const handleAddToGallery = (img: any) => {
    setGalleryImages((prevImages) => [
      { id: img.id, src: img.source_url },
      ...prevImages,
    ]);
  };

  const handleAddToVariants = (variation, image) => {
    setVariantImages((prevVariants) => {
      // Map over the previous variants to update the image for the matching variation
      return prevVariants.map((v) => {
        if (v.id === variation.id) {
          return {
            ...v,
            image: { ...v.image, sourceUrl: image.source_url },
          };
        }
        return v;
      });
    });
  };

  const filteredOptionsTwo = options.filter(
    (option) => option !== selectOptionOne,
  );
  const handleAddToImagesColor = (color, image) => {
    // [
    //   {
    //     color: "Blue",
    //     images: [],
    //   },
    //   {
    //     color: "Green",
    //     images: [],
    //   },
    //   {
    //     color: "Yellow",
    //     images: [],
    //   },
    // ];
    setColorImages((prevColors) => {
      return prevColors.map((c) => {
        if (c.color.toLowerCase() === color.name.toLowerCase()) {
          return {
            ...c,
            images: [
              ...c.images,
              {
                id: image.id,
                src: image.source_url,
                alt: `Image ${image.id}`,
              },
            ],
          };
        }
        return c;
      });
    });
  };
  const handleSaveChanges = async () => {
    //@ts-ignore
    // const result = await uploadImage(files[0], data.user.accessToken);
    // console.log("IMage UPload", result);
    // if (result) {
    //   console.log("Image uploaded successfully");
    // }

    try {
      setLoading(true);
      const result = await updateProductImage(
        product?.product?.id,
        product?.product?.image?.id,
        first,
        data.user.accessToken,
      );

      const galleryImagesSrc = galleryImages
        .filter((img) => img.src !== first)
        .map((img) => img.src);

      const result2 = await updateGalleryImages(
        product?.product?.id,
        galleryImagesSrc,
        data.user.accessToken,
      );
      if (result) {
        toast.success("Image updated successfully");
      }
      if (result2) {
        toast.success("Gallery updated successfully");
      }
      setLoading(false);
    } catch (err) {
      toast.error("Error updating image");
      setLoading(false);
      console.log("Error updating image", err);
    }
  };

  const [existingColours, setExistingColours] = useState(
    getExistingValues("Colour"),
  );
  const [newColours, setNewColours] = useState(
    Array(existingColours.length).fill(""),
  );
  const [existingSizes, setExistingSizes] = useState(getExistingValues("Size"));
  const [newSizes, setNewSizes] = useState(
    Array(existingSizes.length).fill(""),
  );

  const handleStoreAttributes = async () => {
    try {
      console.log("USER", data.user);
      setAttLoading(true);
      if (!data.user) {
        toast.error("You need to be logged in to save changes.");
        return;
      }

      // Use the selected values from state
      const selectedColours = newColours.filter(Boolean); // Only include non-empty values
      const selectedSizes = newSizes.filter(Boolean); // Only include non-empty values

      console.log("Selected Colours:", selectedColours);
      console.log("Selected Sizes:", selectedSizes);
      const parsedValue = sessionUser ? JSON.parse(sessionUser.value) : {};

      const updateProductAttributesResponse = await updateProductAttributes(
        product?.product?.id,
        selectedColours,
        selectedSizes,
        parsedValue.user.accessToken,
      );

      if (updateProductAttributesResponse) {
        toast.success("Attributes updated successfully.");
      } else {
        toast.error("Failed to update attributes.");
      }

      setAttLoading(false);
    } catch (error) {
      console.error("Error updating attributes:", error);
      setAttLoading(false);
      toast.error("An error occurred. Please try again later.");
    }
  };

  const [colours, setColours] = useState(getExistingValues("Colour"));
  const [sizes, setSizes] = useState(getExistingValues("Size"));

  const handleValueChange = (option, idx, newValue) => {
    if (option === "Colour") {
      const updatedColours = [...colours];
      updatedColours[idx] = newValue;
      setColours(updatedColours);
    } else if (option === "Size") {
      const updatedSizes = [...sizes];
      updatedSizes[idx] = newValue;
      setSizes(updatedSizes);
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
                {Array.from({
                  length: 5,
                }).map((_, index) => (
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
                      </div>{" "}
                    </SliderThumbItem>
                  ))}
                </CarouselThumbsContainer>
              )}
            </Carousel>
          </div>
          <CardContent className="grid grid-cols-2 gap-2  h-full w-full space-y-2">
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
          {/* <CardFooter>
            <Button onClick={handleSaveChanges}>Save changes</Button>
          </CardFooter> */}
        </Card>
      </TabsContent>
      <TabsContent value="media" className="h-[800px] overflow-y-auto">
        <Card className="h-full max-h-[1000px] overflow-auto">
          <CardHeader className="flex flex-row justify-between">
            <div></div>
            <Button onClick={handleSaveChanges}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </CardHeader>
          <CardContent className="space-y-2 flex flex-col  overflow-y-auto">
            <div className="m-2 p-2 flex">
              <div className="flex flex-col gap-2">
                <Gallery
                  isColor={false}
                  images={galleryImages}
                  first={first}
                  setFirst={setFirst}
                />
                <div className="relative mx-auto  max-w-[54rem] rounded-xl border bg-black from-gray-100 from-0% to-gray-200 to-100% shadow-lg">
                  {/* title portion */}

                  <div className="sticky top-0 z-[1] bg-white/10 flex min-h-[3rem] flex-wrap items-center gap-1 bg-black overflow-y-hidden border-b  px-4 py-2 [&_*]:leading-6">
                    <div>
                      <h5>Size Section</h5>
                    </div>
                  </div>
                  <div className="w-[54rem]">
                    {(!selectedSizeImage && (
                      <HiPhoto className="w-[54rem] h-[400px] mx-auto my-4" />
                    )) || (
                      <img
                        src={selectedSizeImage.source_url}
                        alt="Selected Image"
                        className="w-auto object-fit h-[400px] mx-auto my-4"
                      />
                    )}
                  </div>
                </div>

                <div className="relative  mx-auto max-w-[54rem] rounded-xl border bg-black from-gray-100 from-0% to-gray-200 to-100% shadow-lg">
                  <div className="sticky bg-white/10 top-0 z-[1] flex min-h-[3rem] flex-wrap items-center gap-1 bg-black overflow-y-hidden border-b  px-4 py-2 [&_*]:leading-6">
                    <div>
                      <h5>Colors</h5>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 w-[54rem] p-4">
                    {product?.product?.allPaColour &&
                      product?.product?.allPaColour.nodes.map((color, idx) => {
                        const colorImage = colorImages.find(
                          (c) =>
                            c.color.toLowerCase() === color.name.toLowerCase(),
                        );
                        return (
                          <div
                            key={idx}
                            className="w-full flex flex-col justify-left items-left"
                          >
                            {colorImage?.images.length <= 0 && (
                              <h5>{color.name}</h5>
                            )}
                            {colorImage?.images.length > 0 ? (
                              <Gallery
                                first={null}
                                setFirst={null}
                                isColor={color.name}
                                images={colorImage.images}
                              />
                            ) : (
                              <span className="flex flex-col justify-start items-start w-full">
                                <HiPhoto className="h-[200px] w-[200px]  my-4" />
                              </span>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* <div className="relative mx-auto max-w-[54rem] rounded-xl border bg-black from-gray-100 from-0% to-gray-200 to-100% shadow-lg">
                  <div className="sticky bg-white/10 top-0 z-[1] flex min-h-[3rem] flex-wrap items-center gap-1 bg-black overflow-y-hidden border-b  px-4 py-2 [&_*]:leading-6">
                    <div>
                      <h5>Variants</h5>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 w-[54rem] p-4">
                    {product?.product?.variations &&
                      variantImages.map((variation, idx) => {
                        console.log("VARIATION", variation);
                        return (
                          <div key={idx} className="">
                            <h5>{variation.name}</h5>
                            <img
                              src={variation.image.sourceUrl}
                              alt="Selected Image"
                              className="w-auto object-fit h-[200px] gap-2 mx-3 my-4"
                            />
                          </div>
                        );
                      })}
                  </div>
                </div> */}
              </div>

              <div className="flex flex-col">
                <FileUploader files={files} setFiles={setFiles} />
                <CardDescription className="m-2 p-2">
                  Choose an Image from the Pool
                </CardDescription>
                <ScrollArea className="max-h-[800px] overflow-y-auto">
                  <div className="m-2 p-2 h-full grid grid-cols-2 md:grid-cols-2 gap-5 my-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          onClick={() => setSelectedImage(image.source_url)}
                          className="h-auto min-h-[200px] max-h-[200px] w-[200px] object-cover max-w-full rounded-lg transition-opacity duration-200 ease-in-out cursor-pointer group-hover:opacity-50"
                          src={image.source_url}
                          alt="Gallery image"
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out">
                          {/* <Button
                            variant="outline"
                            className="m-2 border border-white hover:bg-white hover:text-black min-w-[110px]"
                            onClick={() => handleAddToGallery(image)}
                          >
                            <Plus className="w-6 h-6" />
                            Gallery
                          </Button>
                          <Button
                            variant="outline"
                            className="m-2 border border-white hover:bg-white hover:text-black min-w-[110px]"
                            onClick={() => handleAddToSizes(image)}
                          >
                            <Plus className="w-6 h-6" />
                            Sizes
                          </Button> */}
                          <DropdownMenu>
                            <DropdownMenuTrigger className="bg-red-500" asChild>
                              <Button
                                className="m-2 border border-white bg-transparent hover:bg-white hover:text-black"
                                variant="outline"
                              >
                                <HamburgerMenuIcon className="w-6 h-6" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              side="top"
                              className="w-56 shadow-3xl bg-gray-200 text-black "
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
                              {product?.product.allPaColour && (
                                <DropdownMenuGroup>
                                  <DropdownMenuSub>
                                    <DropdownMenuSubTrigger className="cursor-pointer">
                                      <UserPlus className="mr-2 h-4 w-4 " />
                                      <span className="">Add to Colors</span>
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuPortal className="">
                                      <DropdownMenuSubContent className="bg-gray-200 text-black">
                                        {product?.product?.allPaColour.nodes.map(
                                          (color) => (
                                            <>
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
                                                <span>{color.name}</span>
                                              </DropdownMenuItem>
                                              <DropdownMenuSeparator />
                                            </>
                                          ),
                                        )}
                                      </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                  </DropdownMenuSub>
                                </DropdownMenuGroup>
                              )}
                              {/* <DropdownMenuSeparator />
                              {product?.product.variations && (
                                <DropdownMenuGroup>
                                  <DropdownMenuSub>
                                    <DropdownMenuSubTrigger className="cursor-pointer">
                                      <UserPlus className="mr-2 h-4 w-4 " />
                                      <span className="">Add to Variants</span>
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuPortal className="">
                                      <DropdownMenuSubContent className="bg-gray-200 text-black">
                                        {product?.product?.variations.nodes.map(
                                          (variation) => (
                                            <>
                                              <DropdownMenuItem
                                                onClick={() =>
                                                  handleAddToVariants(
                                                    variation,
                                                    image,
                                                  )
                                                }
                                                className="cursor-pointer"
                                              >
                                                <Plus className="mr-2 h-4 w-4" />
                                                <span>{variation.name}</span>
                                              </DropdownMenuItem>
                                              <DropdownMenuSeparator />
                                            </>
                                          ),
                                        )}
                                      </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                  </DropdownMenuSub>
                                </DropdownMenuGroup>
                              )} */}
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
                                  permanently delete this picture from the pool.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction>Continue</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="size" className="py-10 h-[800px] overflow-y-auto">
        <div className="grid grid-cols-2 ">
          {(selectedSizeImage && (
            <Gallery
              first={null}
              setFirst={null}
              isColor={""}
              images={[
                {
                  id: selectedSizeImage?.id,
                  src: selectedSizeImage?.source_url,
                },
              ]}
            />
          )) || <HiPhoto className="w-[54rem] h-[200px] mx-auto my-4" />}
          <SpreadSheet
            productId={product?.product?.id}
            product={product?.product}
            selectedImage={selectedSizeImage}
            setSelectedImage={setSelectedSizeImage}
            sessionUser={sessionUser}
          />
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
        <div className="flex items-center justify-between mb-4">
          <Button onClick={handleStoreAttributes}>
            {attLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Save Attributes"
            )}
          </Button>
        </div>
        {/* <div className="flex items-center justify-between mb-4">
          <div className="flex items-center w-full max-w-[300px]">
            <Label htmlFor="global-dropdown" className="w-[50%]">
              {selectOptionOne || "Select Option"}
            </Label>
            <Select onValueChange={(value) => setSelectOptionOne(value)}>
              <SelectTrigger className="w-[50%]">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Options</SelectLabel>
                  {filteredOptionsOne.map((option, idx) => (
                    <SelectItem key={idx} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div> */}

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 mb-2">
            <Label>Colour</Label>
          </div>
          {existingColours.map((value, idx) => (
            <div key={idx} className="space-y-2">
              <Input
                id={`input-existing-colour-${idx}`}
                value={value}
                placeholder={value}
                readOnly
              />
            </div>
          ))}
          {newColours.map((value, idx) => (
            <div key={idx} className="space-y-2">
              <Select
                value={value}
                onValueChange={(newValue) => {
                  const updatedColours = [...newColours];
                  updatedColours[idx] = newValue;
                  setNewColours(updatedColours);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a colour" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Options</SelectLabel>
                    {renderSelectContent("Colour")}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="col-span-2 mb-2">
            <Label>Size</Label>
          </div>
          {existingSizes.map((value, idx) => (
            <div key={idx} className="space-y-2">
              <Input
                id={`input-existing-size-${idx}`}
                value={value}
                placeholder={value}
                readOnly
              />
            </div>
          ))}
          {newSizes.map((value, idx) => (
            <div key={idx} className="space-y-2">
              <Select
                value={value}
                onValueChange={(newValue) => {
                  const updatedSizes = [...newSizes];
                  updatedSizes[idx] = newValue;
                  setNewSizes(updatedSizes);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Options</SelectLabel>
                    {renderSelectContent("Size")}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
