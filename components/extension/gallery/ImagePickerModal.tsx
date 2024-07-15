import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Upload, X, Loader2 } from "lucide-react";
import action from "@/app/actions";
import toast from "react-hot-toast";

const ImagePickerModal = ({ onUpload }) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setSelectedImages((prevImages) => [...prevImages, ...newImages]);
  };

  const removeImage = (index) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (onUpload && selectedImages.length > 0) {
      setIsUploading(true);
      setUploadProgress(0);
      try {
        for (let i = 0; i < selectedImages.length; i++) {
          await onUpload([selectedImages[i].file]);
          setUploadProgress(((i + 1) / selectedImages.length) * 100);
        }
        console.log("All files uploaded successfully");
        toast.success("Images uploaded successfully!");
        action("refreshProduct");
        setSelectedImages([]);
        setIsOpen(false); // Close the modal after successful upload
      } catch (error) {
        console.error("Upload failed:", error);
        // Optionally, you could show an error message to the user here
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {/* <Button variant="outline" >
          Choose Images
        </Button> */}
        <>
          <div className="w-full max-w-md border-2 border-gray-300 border-dashed rounded-lg p-6 flex flex-col items-center justify-center space-y-4 dark:border-gray-700">
            <Upload className="w-12 h-12 text-gray-400" />
            <p className="text-gray-500 dark:text-gray-400">
              Drag and drop your images here
            </p>
            <Button onClick={() => setIsOpen(true)} variant="outline">
              Browse Files
            </Button>
          </div>
        </>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Choose Images from Your PC</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4 p-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept="image/*"
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current.click()}
            variant="outline"
            className="w-full"
            disabled={isUploading}
          >
            <Upload className="mr-2 h-4 w-4" /> Select Images
          </Button>
          <div className="grid grid-cols-3 gap-4 w-full">
            {selectedImages.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image.preview}
                  alt={`Selected ${index + 1}`}
                  className="w-full h-24 object-cover rounded-md"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          {isUploading && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <Button
            variant="outline"
            onClick={() => setSelectedImages([])}
            disabled={isUploading}
          >
            Clear
          </Button>
          <Button
            onClick={handleUpload}
            disabled={selectedImages.length === 0 || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" /> Upload
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImagePickerModal;
