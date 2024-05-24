import { memo } from "react";
import { IoLogoGithub, IoLogoLinkedin } from "react-icons/io5";

const GalleryFooter = memo(() => {
  return (
    <div className="flex min-h-[2.5rem] flex-wrap items-center gap-1 border-t border-gray-300 px-4 py-2 xl:gap-2 [&_*]:leading-6">
      <div className="flex items-center gap-1 xl:gap-2"></div>
      <div className="flex items-center gap-2 max-sm:w-full sm:ms-auto"></div>
    </div>
  );
});

GalleryFooter.displayName = "GalleryFooter";

export default GalleryFooter;
