"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FilePlus2, X, FileText } from "lucide-react";
import { useFileDropzone } from "@/components/useFileDropzone";
import { motion, AnimatePresence } from "framer-motion";
import ImageGalleryDialog from "./ImageGalleryDialog";

interface FileWithPreview extends File {
  preview: string;
}

interface FilePreviewProps {
  setFiles: (files: File[]) => void;
  uploadProgress?: { [key: string]: number };
}

export default function FilePreview({ setFiles, uploadProgress = {} }: FilePreviewProps) {
  const { files, getRootProps, getInputProps, setFiles: setDropzoneFiles } = useFileDropzone();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(-1);

  useEffect(() => {
    setFiles(files);
  }, [files, setFiles]);

  const isImage = (file: FileWithPreview) => file.type.startsWith("image/");

  const removeFile = (fileName: string) => {
    const newFiles = files.filter(file => file.name !== fileName);
    setDropzoneFiles(newFiles);
  };

  const getFilePreview = (file: FileWithPreview) => {
    if (isImage(file)) {
      return (
        <Image
          src={file.preview}
          alt={file.name}
          width={400}
          height={400}
          className="w-full h-full object-cover rounded-xl"
          onClick={() => {
            const imageIndex = files.findIndex((f) => f.name === file.name);
            setSelectedImageIndex(imageIndex);
          }}
        />
      );
    }
    return (
      <div className="w-full h-full flex items-center justify-center">
        <FileText className="w-12 h-12 text-base-content/40" />
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps({
          className:
            "border-2 border-dashed border-base-200 rounded-xl p-8 cursor-pointer hover:border-primary/50 hover:bg-base-200/30 transition-colors",
        })}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          <div className="p-4 bg-base-200 rounded-xl">
            <FilePlus2 size={32} className="text-base-content/60" />
          </div>
          <div className="text-center">
            <p className="font-medium">Drop files here or click to select</p>
            <p className="text-sm text-base-content/60 mt-1">
              Supports images and documents
            </p>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <motion.div
          className="grid grid-cols-8 md:grid-cols-8 sm:grid-cols-6 gap-4"
          layout
        >
          <AnimatePresence>
            {files.map((file) => (
              <motion.div
                key={file.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative aspect-square group"
              >
                <div className="absolute inset-0 rounded-xl border border-base-200 overflow-hidden bg-base-200/50">
                  {getFilePreview(file as FileWithPreview)}
                </div>

                <motion.button
                  className="absolute -top-2 -right-2 btn btn-circle btn-error btn-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(file.name);
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4" />
                </motion.button>

                {uploadProgress[file.name] !== undefined && (
                  <div className="absolute inset-x-4 bottom-4">
                    <div className="w-full bg-base-100/50 rounded-full h-1.5">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress[file.name]}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-xs truncate px-2 py-1 rounded-lg bg-base-100/50 backdrop-blur-sm">
                    {file.name}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <ImageGalleryDialog
        images={files
          .filter((file): file is FileWithPreview => isImage(file as FileWithPreview))
          .map((file) => ({ url: (file as FileWithPreview).preview, name: file.name }))}
        initialIndex={selectedImageIndex}
        isOpen={selectedImageIndex !== -1}
        onClose={() => setSelectedImageIndex(-1)}
      />
    </div>
  );
}
