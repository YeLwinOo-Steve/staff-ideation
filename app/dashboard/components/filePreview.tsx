"use client";
import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { FilePlus2, X, FileText, Image as ImageIcon } from "lucide-react";
import { useFileDropzone } from "@/components/useFileDropzone";
import { motion, AnimatePresence } from "framer-motion";
import ImageGalleryDialog from "./ImageGalleryDialog";
import { useToast } from "@/components/toast";
import { useFileDropzoneUtil } from "@/components/useFileDropzoneUtil";

const MAX_FILES = 6;

interface FileWithPreview extends File {
  preview: string;
}

interface FilePreviewProps {
  setFiles: (files: File[]) => void;
  uploadProgress?: { [key: string]: number };
}

export default function FilePreview({ setFiles, uploadProgress = {} }: FilePreviewProps) {
  const { showErrorToast } = useToast();
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length + files.length > MAX_FILES) {
      showErrorToast(`You can only upload up to ${MAX_FILES} files`);
      return;
    }
    return acceptedFiles;
  }, []);

  const { files, getRootProps, getInputProps, setFiles: setDropzoneFiles } = useFileDropzoneUtil({ onDrop });
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(-1);
  const [previewFiles, setPreviewFiles] = useState<FileWithPreview[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    setFiles(files);
    // Create preview URLs for images only on client side
    const imageFiles = files.filter(file => file.type.startsWith('image/')).map(file => {
      return Object.assign(file, {
        preview: URL.createObjectURL(file)
      }) as FileWithPreview;
    });
    setPreviewFiles(imageFiles);

    // Cleanup preview URLs when component unmounts or files change
    return () => {
      previewFiles.forEach(file => URL.revokeObjectURL(file.preview));
    };
  }, [files, setFiles, mounted]);

  const isImage = (file: File) => file.type.startsWith("image/");

  const removeFile = (e: React.MouseEvent, fileName: string) => {
    e.preventDefault();
    e.stopPropagation();
    const newFiles = files.filter(file => file.name !== fileName);
    setDropzoneFiles(newFiles);
  };

  const handleImageClick = (e: React.MouseEvent, file: File) => {
    e.preventDefault();
    e.stopPropagation();
    const imageIndex = previewFiles.findIndex((f) => f.name === file.name);
    if (imageIndex !== -1) {
      setSelectedImageIndex(imageIndex);
    }
  };

  const ImagePreview = ({ file, previewFile }: { file: File, previewFile: FileWithPreview }) => {
    if (!mounted) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-base-200">
          <ImageIcon className="w-12 h-12 text-base-content/40" />
        </div>
      );
    }

    return (
      <div className="relative w-full h-full">
        <Image
          src={previewFile.preview}
          alt={file.name}
          width={400}
          height={400}
          className="w-full h-full object-cover rounded-xl cursor-pointer"
          onClick={(e) => handleImageClick(e, file)}
        />
      </div>
    );
  };

  const getFilePreview = (file: File) => {
    if (isImage(file)) {
      const previewFile = previewFiles.find(pf => pf.name === file.name);
      if (!previewFile) {
        return (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="w-12 h-12 text-base-content/40" />
          </div>
        );
      }
      
      return <ImagePreview file={file} previewFile={previewFile} />;
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
              Supports images and documents (max {MAX_FILES} files)
            </p>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <motion.div
          className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-8 sm:grid-cols-3 gap-4"
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
                onClick={(e) => e.stopPropagation()}
              >
                <div className="absolute inset-0 rounded-xl border border-base-200 overflow-hidden bg-base-200/50">
                  {getFilePreview(file)}
                </div>

                <motion.button
                  className="absolute -top-2 -right-2 btn btn-circle btn-error btn-sm opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => removeFile(e, file.name)}
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

      {mounted && selectedImageIndex !== -1 && (
        <ImageGalleryDialog
          images={previewFiles.map(file => ({ url: file.preview, name: file.name }))}
          initialIndex={selectedImageIndex}
          isOpen={selectedImageIndex !== -1}
          onClose={() => setSelectedImageIndex(-1)}
        />
      )}
    </div>
  );
}
