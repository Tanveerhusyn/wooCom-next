"use client";
import { useState } from "react";
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
import { Product } from "@/types";
import {
  Carousel,
  CarouselMainContainer,
  CarouselNext,
  CarouselPrevious,
  SliderMainItem,
  CarouselThumbsContainer,
  SliderThumbItem,
} from "@/components/extension/carousel";

export default function ProductDetail({ product }: { product: Product }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    title: "",
    body: "",
    color: "",
    size: "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [id]: value }));
  };

  const handleSaveChanges = () => {};
  return (
    <Tabs className="w-full" defaultValue="overview">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="media">Media</TabsTrigger>
        <TabsTrigger value="text">Text</TabsTrigger>
        <TabsTrigger value="attributes">Attributes</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <Card className="flex justify-between items-start p-4">
          <div className="flex flex-col justify-center items-start w-[60%] bg-white/10 shadow-md rounded-lg p-4">
            <CardHeader>
              <CardTitle>{product?.name}</CardTitle>
              <CardDescription>
                View and edit the overview details for this item.
              </CardDescription>
            </CardHeader>
            <Carousel className="s-full">
              <CarouselNext className="top-1/3 -translate-y-1/3" />
              <CarouselPrevious className="top-1/3 -translate-y-1/3" />
              <CarouselMainContainer className="h-60">
                {Array.from({ length: 5 }).map((_, index) => (
                  <SliderMainItem key={index} className="bg-transparent">
                    <img
                      src={product.image.sourceUrl}
                      alt={product?.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </SliderMainItem>
                ))}
              </CarouselMainContainer>
              <CarouselThumbsContainer>
                {Array.from({ length: 5 }).map((_, index) => (
                  <SliderThumbItem
                    key={index}
                    index={index}
                    className="bg-transparent"
                  >
                    <div className="outline outline-1 outline-border size-full flex items-center justify-center rounded-xl bg-background">
                      Slide {index + 1}
                    </div>{" "}
                  </SliderThumbItem>
                ))}
              </CarouselThumbsContainer>
            </Carousel>
          </div>
          <CardContent className="grid grid-cols-2 gap-2  h-full w-full space-y-2">
            {/* <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 gap-4 last:mb-0 last:pb-0">
              <span></span>
              <div className="flex flex-col gap-2 space-y-1">
                <Label htmlFor="name">Name:</Label>
                <Input
                  defaultValue={product.name}
                  id="name"
                  readOnly
                  onChange={handleInputChange}
                />
              </div>
              <span></span>
              <div className="flex flex-col gap-2 space-y-1">
                <Label htmlFor="category">Category:</Label>
                <Input
                  defaultValue={product.category}
                  id="category"
                  readOnly
                  onChange={handleInputChange}
                />
              </div>
              <span></span>
              <div className="flex flex-col gap-2 space-y-1">
                <Label htmlFor="price">Price:</Label>
                <Input
                  defaultValue={product.price}
                  id="price"
                  readOnly
                  onChange={handleInputChange}
                />
              </div>
              <span></span>
              <div className="flex flex-col gap-2 space-y-1">
                <Label htmlFor="price">Color:</Label>
                <Input defaultValue={"green"} id="price" readOnly />
              </div>
            </div>
            <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 gap-4 last:mb-0 last:pb-0">
              <span></span>
              <div className="flex flex-col gap-2 space-y-1">
                <Label htmlFor="name">Size:</Label>
                <Input defaultValue={"XL"} id="name" readOnly />
              </div>
            </div> */}

            <dl className="max-w-md text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
              <div className="flex flex-col pb-3">
                <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
                  Product Name
                </dt>
                <dd className="text-lg font-semibold">{product.name}</dd>
              </div>
              <div className="flex flex-col py-3">
                <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
                  Description
                </dt>
                <dd
                  className="text-lg font-semibold"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                ></dd>
              </div>
              <div className="flex flex-col pt-3">
                <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
                  Price
                </dt>
                <dd className="text-lg font-semibold">{product.price}</dd>
              </div>
              <div className="flex flex-col pt-3">
                <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
                  Variant
                </dt>
                <dd className="text-lg font-semibold">Secondary</dd>
              </div>
            </dl>
            <dl className="max-w-md text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
              <div className="flex flex-col pb-3">
                <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
                  Color
                </dt>
                <dd className="text-lg font-semibold">Green</dd>
              </div>
              <div className="flex flex-col py-3">
                <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
                  Size
                </dt>
                <dd className="text-lg font-semibold">XXL</dd>
              </div>
              <div className="flex flex-col pt-3">
                <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
                  Status
                </dt>
                <dd className="text-lg font-semibold">Active</dd>
              </div>
            </dl>
          </CardContent>
          {/* <CardFooter>
            <Button onClick={handleSaveChanges}>Save changes</Button>
          </CardFooter> */}
        </Card>
      </TabsContent>
      <TabsContent value="media">
        <Card>
          <CardHeader>
            <CardTitle>Media</CardTitle>
            <CardDescription>
              Upload and manage the media assets for this item.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="image">Image</Label>
              <Input id="image" type="file" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="video">Video</Label>
              <Input id="video" type="file" />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveChanges}>Save changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="text">
        <Card>
          <CardHeader>
            <CardTitle>Text</CardTitle>
            <CardDescription>
              Edit the text content for this item.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="title">Title</Label>
              <Input
                defaultValue={product.title}
                id="title"
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="body">Body</Label>
              <Textarea
                defaultValue={product.body}
                id="body"
                onChange={handleInputChange}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveChanges}>Save changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="attributes">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Attributes</CardTitle>
            <CardDescription>
              Manage the attributes for this item.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 bg-white">
            <div className="space-y-1">
              <Label htmlFor="color">Color</Label>
              <Input
                defaultValue={product.color}
                id="color"
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="size">Size</Label>
              <Input
                defaultValue={product.size}
                id="size"
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="price">Price</Label>
              <Input
                defaultValue={product.price}
                id="price"
                onChange={handleInputChange}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveChanges}>Save changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
