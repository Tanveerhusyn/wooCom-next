import { defaultAnimateLayoutChanges, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Switch, Transition } from "@headlessui/react";
import { memo, useState } from "react";
import { HiOutlineStar } from "react-icons/hi2";
import { IoCheckmarkCircleSharp, IoExpand } from "react-icons/io5";

const Image = memo((props) => {
  const [isHovered, setIsHovered] = useState(false);
  const {
    image,
    className,
    featured,
    isMarked,
    handleMarked,
    handleFeatured,
    setImgBoxElm,
    ...sanitizedProps
  } = props;

  console.log("image Inside", image);
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
    "cursor-grab relative overflow-hidden flex items-center justify-center",
    className ?? "",
    isDragging ? "[&>*]:opacity-30 [&>*]:brightness-75 shadow-inner" : "",
    featured ? "col-span-2 row-span-2" : "",
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
Image.displayName = "Image";
export default Image;
