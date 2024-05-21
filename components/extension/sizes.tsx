"use client";
import { Fragment, useState } from "react";
import {
  Dialog,
  RadioGroup,
  Transition,
  TransitionChild,
  DialogPanel,
  Label,
  Radio,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/20/solid";
import { Button } from "../ui/button";

const product = {
  name: "Basic Tee 6-Pack ",
  price: "$192",
  rating: 3.9,
  reviewCount: 117,
  href: "#",
  imageSrc:
    "https://tailwindui.com/img/ecommerce-images/product-quick-preview-02-detail.jpg",
  imageAlt: "Two each of gray, white, and black shirts arranged on table.",
  colors: [
    { name: "White", class: "bg-white", selectedClass: "ring-gray-400" },
    { name: "Gray", class: "bg-gray-200", selectedClass: "ring-gray-400" },
    { name: "Black", class: "bg-white", selectedClass: "ring-white" },
    { name: "Red", class: "bg-red-500", selectedClass: "ring-red-400" },
    { name: "Blue", class: "bg-blue-500", selectedClass: "ring-blue-400" },
    { name: "Green", class: "bg-green-500", selectedClass: "ring-green-400" },
    {
      name: "Yellow",
      class: "bg-yellow-500",
      selectedClass: "ring-yellow-400",
    },
    {
      name: "Purple",
      class: "bg-purple-500",
      selectedClass: "ring-purple-400",
    },
    {
      name: "Orange",
      class: "bg-orange-500",
      selectedClass: "ring-orange-400",
    },
    { name: "Pink", class: "bg-pink-500", selectedClass: "ring-pink-400" },
  ],
  sizes: [
    { name: "XXS", inStock: true },
    { name: "XS", inStock: true },
    { name: "S", inStock: true },
    { name: "M", inStock: true },
    { name: "L", inStock: true },
    { name: "XL", inStock: true },
    { name: "XXL", inStock: true },
    { name: "XXXL", inStock: false },
    { name: "4XL", inStock: true },
    { name: "5XL", inStock: false },
  ],
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Sizes() {
  const [open, setOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[2]);

  return (
    <>
      <div className="flex w-full  transform text-left bg-black text-base transition p-4 md:my-8 md:max-w-2xl md:px-4 lg:max-w-4xl">
        <div className="relative flex w-full items-center overflow-hidden bg-white/10 rounded-lg px-4 pb-8 pt-14 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
          <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8">
            <div className="sm:col-span-8 lg:col-span-7">
              <h2 className="text-2xl font-bold text-white sm:pr-12">
                Choose color and size
              </h2>

              <section aria-labelledby="information-heading" className="mt-2">
                <h3 id="information-heading" className="sr-only">
                  Product information
                </h3>

                {/* Reviews */}
              </section>

              <section aria-labelledby="options-heading" className="mt-10">
                <h3 id="options-heading" className="sr-only">
                  Product options
                </h3>

                <form>
                  {/* Colors */}
                  <div>
                    <h4 className="text-sm font-medium text-white">Color</h4>

                    <RadioGroup
                      value={selectedColor}
                      onChange={setSelectedColor}
                      className="mt-4"
                    >
                      <Label className="sr-only">Choose a color</Label>
                      <span className="flex items-center space-x-3">
                        {product.colors.map((color) => (
                          <Radio
                            key={color.name}
                            value={color}
                            className={({ active, checked }) =>
                              classNames(
                                color.selectedClass,
                                active && checked ? "ring ring-offset-1" : "",
                                !active && checked ? "ring-2" : "",
                                "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none",
                              )
                            }
                          >
                            <Label as="span" className="sr-only">
                              {color.name}
                            </Label>
                            <span
                              aria-hidden="true"
                              className={classNames(
                                color.class,
                                "h-8 w-8 rounded-full border border-black border-opacity-10",
                              )}
                            />
                          </Radio>
                        ))}
                      </span>
                    </RadioGroup>
                  </div>

                  {/* Sizes */}
                  <div className="mt-10">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-white">Size</h4>
                      <a
                        href="#"
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Size guide
                      </a>
                    </div>

                    <RadioGroup
                      value={selectedSize}
                      onChange={setSelectedSize}
                      className="mt-4"
                    >
                      <Label className="sr-only">Choose a size</Label>
                      <div className="grid grid-cols-4 gap-4">
                        {product.sizes.map((size) => (
                          <Radio
                            key={size.name}
                            value={size}
                            disabled={!size.inStock}
                            className={({ active }) =>
                              classNames(
                                size.inStock
                                  ? "cursor-pointer bg-white text-black shadow-sm"
                                  : "cursor-not-allowed bg-gray-50 text-gray-200",
                                active ? "ring-4 ring-indigo-500" : "",
                                "group relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1",
                              )
                            }
                          >
                            {({ active, checked }) => (
                              <>
                                <Label as="span">{size.name}</Label>
                                {size.inStock ? (
                                  <span
                                    className={classNames(
                                      active ? "border" : "border-2",
                                      checked
                                        ? "border-indigo-500"
                                        : "border-transparent",
                                      "pointer-events-none absolute -inset-px rounded-md",
                                    )}
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <span
                                    aria-hidden="true"
                                    className="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200"
                                  >
                                    <svg
                                      className="absolute inset-0 h-full w-full stroke-2 text-gray-200"
                                      viewBox="0 0 100 100"
                                      preserveAspectRatio="none"
                                      stroke="currentColor"
                                    >
                                      <line
                                        x1={0}
                                        y1={100}
                                        x2={100}
                                        y2={0}
                                        vectorEffect="non-scaling-stroke"
                                      />
                                    </svg>
                                  </span>
                                )}
                              </>
                            )}
                          </Radio>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  <Button className="mt-6 " variant="default">
                    Save Changes
                  </Button>
                </form>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
