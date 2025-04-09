"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { Camera, Upload, X } from "lucide-react";
import { motion } from "framer-motion";

interface UserPhotoUploadProps {
  initialPhoto: string | null;
  onPhotoChange: (file: File | null) => void;
}

export default function UserPhotoUpload({
  initialPhoto,
  onPhotoChange,
}: UserPhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(initialPhoto);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback(
    (file: File | null) => {
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        onPhotoChange(file);
      }
    },
    [onPhotoChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        handleFileChange(file);
      }
    },
    [handleFileChange]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removePhoto = useCallback(() => {
    setPreview(null);
    onPhotoChange(null);
  }, [onPhotoChange]);

  return (
    <div className="space-y-4 max-w-32 max-h-32 mx-auto">
      {/* Photo Preview */}
      {preview ? (
        <div className="relative group">
          <div className="aspect-square w-full overflow-hidden rounded-2xl bg-base-200">
            <Image
              src={preview}
              alt="Profile preview"
              width={400}
              height={400}
              className="w-full h-full object-cover"
            />
          </div>
          <motion.button
            className="absolute top-2 right-2 btn btn-circle btn-sm bg-base-100/80 backdrop-blur-sm border-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={removePhoto}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-4 h-4" />
          </motion.button>
        </div>
      ) : (
        <motion.div
          className={`aspect-square w-full rounded-2xl border-2 border-dashed transition-colors relative flex flex-col items-center justify-center gap-3 cursor-pointer
            ${isDragging ? "border-primary bg-primary/5" : "border-base-300 hover:border-primary/50 hover:bg-base-200/50"}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          whileHover={{ scale: 1.01 }}
          onClick={() => document.getElementById("photo-input")?.click()}
        >
          <div
            className={`p-3 absolute top-5 rounded-xl transition-colors ${isDragging ? "bg-primary/10" : "bg-base-200"}`}
          >
            <Upload
              className={`w-6 h-6 ${isDragging ? "text-primary" : "opacity-70"}`}
            />
          </div>
          <p className="text-xs text-base-content/50 absolute bottom-3 text-center">
            PNG, JPG or GIF (max. 2MB)
          </p>
        </motion.div>
      )}

      <input
        id="photo-input"
        type="file"
        className="hidden"
        accept="image/*"
        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
      />
    </div>
  );
}
