import { defaultAnimateLayoutChanges, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Switch, Transition } from "@headlessui/react";
import { memo, useState } from "react";
import { HiOutlineStar } from "react-icons/hi2";
import { IoCheckmarkCircleSharp, IoExpand } from "react-icons/io5";
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
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { TagIcon, UserPlus, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
const ColorImage = memo((props) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const {
    image,
    className,
    featured,
    isMarked,
    handleMarked,
    handleFeatured,
    setImgBoxElm,
    state,
    handleImageTypeChange,
    handleGenderChange,
    handleSkinColorChange,
    handleSaveMetadata,
    product,
    handleAddToImagesColor,
    ...sanitizedProps
  } = props;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: image.id,
    transition: {
      duration: 300,
      easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    },
    // Required to animate when sorted by other means except dragging
    animateLayoutChanges: (args) =>
      defaultAnimateLayoutChanges({
        ...args,
        wasDragging: true,
      }),
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition,
    transformOrigin: "0 0",
    // Required for mobile devices to prevent scroll while trying to drag
    touchAction: "none",
    ...sanitizedProps.style,
  };

  // Cleaner approach
  const containerClasses = [
    "cursor-grab relative group overflow-hidden flex items-center justify-center",
    className ?? "",
    isDragging ? "[&>*]:opacity-30 [&>*]:brightness-75 shadow-inner" : "",
    featured ? "" : "",
  ]
    .join(" ")
    .trim();

  return (
    <div
      {...sanitizedProps}
      {...attributes}
      {...listeners}
      className={containerClasses}
      onMouseOver={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      ref={setNodeRef}
      style={style}
    >
      <img
        className={`h-full w-full object-cover transition-transform duration-300 ${
          isHovered && !isDragging ? "sm:scale-105" : ""
        }`}
        // mobile devices keep focus/hover state even after dragging. As the actual element differs from floating element, a sudden scale shift happens on drag end
        src={image?.src}
        alt={image?.id}
      />

      <div
        style={{
          position: "absolute",
          zIndex: 999,
        }}
        className="absolute z-99 cursor-pointer inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out"
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="m-2 border border-white bg-transparent hover:bg-white hover:text-black"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                console.log("Hamburger button clicked");
              }}
            >
              <HamburgerMenuIcon className="w-6 h-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="right"
            align="start"
            className="w-56 shadow-3xl bg-gray-200 text-black"
          >
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <TagIcon className="mr-2 h-4 w-4" />
                <span>Image Metadata</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-full p-4 bg-gray-200 text-black">
                <div className="space-y-4">
                  <div>
                    <Label className="mb-2 block">Image Type</Label>
                    <Select
                      value={
                        state.imageMetadata[image.id]?.imageType || "product"
                      }
                      onValueChange={(value) =>
                        handleImageTypeChange(image, value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="product">Product</SelectItem>
                        <SelectItem value="person">Person</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {state.imageMetadata[image.id]?.imageType === "person" && (
                    <div>
                      <div>
                        <Label htmlFor="gender" className="mb-1 block">
                          Gender
                        </Label>
                        <Select
                          value={state.imageMetadata[image.id]?.gender || ""}
                          onValueChange={(value) =>
                            handleGenderChange(image, value)
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="skinColor" className="mb-1 block">
                          Skin Tone
                        </Label>
                        <Select
                          value={state.imageMetadata[image.id]?.skinColor || ""}
                          onValueChange={(value) =>
                            handleSkinColorChange(image, value)
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Skin Tone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem
                              className="bg-[#FDE8DC] text-black"
                              value="ivory"
                            >
                              Ivory
                            </SelectItem>
                            <SelectItem
                              className="bg-[#FAD7C3] text-black"
                              value="fair"
                            >
                              Fair
                            </SelectItem>
                            <SelectItem
                              className="bg-[#E5C1A1] text-black"
                              value="beige"
                            >
                              Beige
                            </SelectItem>
                            <SelectItem
                              className="bg-[#D7A77E] text-black"
                              value="tan"
                            >
                              Tan
                            </SelectItem>
                            <SelectItem
                              className="bg-[#BA8B68] text-black"
                              value="olive"
                            >
                              Olive
                            </SelectItem>
                            <SelectItem
                              className="bg-[#A77D5A] text-black"
                              value="bronze"
                            >
                              Bronze
                            </SelectItem>
                            <SelectItem
                              className="bg-[#8B6851] text-black"
                              value="brown"
                            >
                              Brown
                            </SelectItem>
                            <SelectItem
                              className="bg-[#8B6851] text-black"
                              value="darkBrown"
                            >
                              Dark Brown
                            </SelectItem>
                            <SelectItem
                              className="bg-[#6E503D] text-black"
                              value="ebony"
                            >
                              Ebony
                            </SelectItem>
                            <SelectItem
                              className="bg-[#38271C] text-black"
                              value="black"
                            >
                              Black
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                  <Button
                    className="bg-black text-white hover:bg-gray-800"
                    onClick={() => {
                      console.log("METADATA", image);
                      handleSaveMetadata(image.id);
                    }}
                  >
                    Save Metadata
                  </Button>
                </div>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* Overlay for buttons */}
      <Transition
        show={isHovered || isMarked}
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-0"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          className={`overlay absolute inset-0 grid grid-cols-[repeat(2,_max-content)] place-content-between p-2  ${
            isMarked ? "backdrop-brightness-105 backdrop-contrast-50" : ""
          }`}
        >
          {/* Selection */}
          <div>
            <Switch
              title={isMarked ? "Unmark item" : "Mark item"}
              checked={isMarked}
              onChange={(bool) => handleMarked(image.id, bool)}
              name={image.id}
              className={` grid place-items-center rounded-full border-2 bg-white text-2xl text-accent`}
            >
              <span className="sr-only">Mark item</span>
              <IoCheckmarkCircleSharp
                className={`fill-current transition-opacity ${
                  isMarked ? "opacity-100" : "opacity-30 hover:opacity-70"
                }`}
              />
            </Switch>
          </div>

          {/* Empty cell fillup */}
          <div></div>

          {/* Imagebox */}
          <div>
            {isHovered && (
              <button
                className={`grid place-items-center rounded-full bg-white text-2xl text-body opacity-70 transition-opacity hover:opacity-100`}
                onClick={() => setImgBoxElm(image)}
                title="Expand image"
              >
                <IoExpand className="p-0.5" />
              </button>
            )}
          </div>
        </div>
      </Transition>
    </div>
  );
});
ColorImage.displayName = "ColorImage";
export default ColorImage;
