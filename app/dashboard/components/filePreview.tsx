"use client";
import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { FilePlus2, X, FileText, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ImageGalleryDialog from "./ImageGalleryDialog";
import { useToast } from "@/components/toast";
import { useFileDropzoneUtil } from "@/components/useFileDropzoneUtil";
import { Document } from "@/api/models";

const MAX_FILES = 6;

interface FileWithPreview extends File {
  preview: string;
}

interface FilePreviewProps {
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  uploadProgress?: { [key: string]: number };
  existingFiles?: Document[];
  onRemoveExistingFile?: (file: Document) => void;
}

const FilePreview = ({
  setFiles,
  uploadProgress = {},
  existingFiles = [],
  onRemoveExistingFile,
}: FilePreviewProps) => {
  const { showErrorToast } = useToast();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(-1);
  const [previewFiles, setPreviewFiles] = useState<FileWithPreview[]>([]);
  const [mounted, setMounted] = useState(false);
  const [currentFiles, setCurrentFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (
        acceptedFiles.length +
          currentFiles.length +
          (existingFiles?.length || 0) >
        MAX_FILES
      ) {
        showErrorToast(`You can only upload up to ${MAX_FILES} files`);
        return;
      }
      return acceptedFiles;
    },
    [currentFiles.length, existingFiles?.length, showErrorToast],
  );

  const {
    files,
    getRootProps,
    getInputProps,
    setFiles: setDropzoneFiles,
  } = useFileDropzoneUtil({ onDrop });

  useEffect(() => {
    setCurrentFiles(files);
  }, [files]);

  useEffect(() => {
    setMounted(true);

    if (!mounted) return;

    const imageFiles = files
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => {
        return Object.assign(file, {
          preview: URL.createObjectURL(file),
        }) as FileWithPreview;
      });

    setPreviewFiles(imageFiles);
    setFiles(files);

    return () => {
      imageFiles.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files, setFiles, mounted]);

  const isImage = (file: File | Document): boolean => {
    if ((file as Document).file_path) {
      const cloudinaryFile = file as Document;
      return /\.(jpg|jpeg|png|gif|webp)$/i.test(cloudinaryFile.file_path);
    }
    const localFile = file as File;
    return localFile.type.startsWith("image/");
  };

  const removeFile = (e: React.MouseEvent, fileName: string) => {
    e.preventDefault();
    e.stopPropagation();
    const newFiles = files.filter((file) => file.name !== fileName);
    setDropzoneFiles(newFiles);
  };

  const removeExistingFile = (e: React.MouseEvent, file: Document) => {
    e.preventDefault();
    e.stopPropagation();
    onRemoveExistingFile?.(file);
  };

  const handleImageClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedImageIndex(index);
  };

  const getAllImages = () => {
    const localImages = previewFiles.map((file) => ({
      url: file.preview,
      name: file.name,
    }));

    const cloudinaryImages = existingFiles
      .filter((file) => isImage(file))
      .map((file) => ({
        url: file.file_path,
        name: file.file_name,
      }));

    return [...cloudinaryImages, ...localImages];
  };

  const getFilePreview = (file: File | Document, isExisting = false) => {
    if (isImage(file)) {
      if (isExisting) {
        const cloudinaryFile = file as Document;
        return (
          <div className="relative w-full h-full">
            <Image
              src={cloudinaryFile.file_path}
              alt={cloudinaryFile.file_name}
              width={400}
              height={400}
              className="w-full h-full object-cover rounded-xl cursor-pointer"
              onClick={(e) =>
                handleImageClick(
                  e,
                  existingFiles.findIndex(
                    (f) => f.file_path === cloudinaryFile.file_path,
                  ),
                )
              }
              priority
            />
          </div>
        );
      }

      const localFile = file as File;
      const previewFile = previewFiles.find((pf) => pf.name === localFile.name);
      if (!previewFile) {
        return (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="w-12 h-12 text-base-content/40" />
          </div>
        );
      }

      return (
        <div className="relative w-full h-full">
          <Image
            src={previewFile.preview}
            alt={localFile.name}
            width={400}
            height={400}
            className="w-full h-full object-cover rounded-xl cursor-pointer"
            onClick={(e) =>
              handleImageClick(
                e,
                previewFiles.length +
                  existingFiles.findIndex(
                    (f) => f.file_path === previewFile.preview,
                  ),
              )
            }
            priority
          />
        </div>
      );
    }

    return (
      <div className="w-full h-full flex items-center justify-center">
        <FileText className="w-12 h-12 text-base-content/40" />
      </div>
    );
  };

  const totalFiles = files.length + existingFiles.length;

  return (
    <div className="space-y-4">
      <div
        {...(totalFiles >= MAX_FILES
          ? {}
          : getRootProps({
              className:
                "border-2 border-dashed border-base-200 rounded-xl p-8 cursor-pointer hover:border-primary/50 hover:bg-base-200/30 transition-colors",
            }))}
        className={`border-2 border-dashed rounded-xl p-8 ${
          totalFiles >= MAX_FILES
            ? "border-base-200/40 bg-base-200/10 cursor-not-allowed"
            : "border-base-200 cursor-pointer hover:border-primary/50 hover:bg-base-200/30 transition-colors"
        }`}
      >
        {totalFiles < MAX_FILES && <input {...getInputProps()} />}
        <div className="flex flex-col items-center gap-3">
          <div
            className={`p-4 rounded-xl ${totalFiles >= MAX_FILES ? "bg-base-200/40" : "bg-base-200"}`}
          >
            <FilePlus2
              size={32}
              className={`${totalFiles >= MAX_FILES ? "text-base-content/30" : "text-base-content/60"}`}
            />
          </div>
          <div className="text-center">
            <p
              className={`font-medium ${totalFiles >= MAX_FILES ? "text-base-content/40" : ""}`}
            >
              {totalFiles >= MAX_FILES
                ? "Maximum files reached"
                : "Drop files here or click to select"}
            </p>
            <p
              className={`text-sm mt-1 ${totalFiles >= MAX_FILES ? "text-base-content/30" : "text-base-content/60"}`}
            >
              Supports images and documents (max {MAX_FILES} files)
            </p>
          </div>
        </div>
      </div>

      {(existingFiles.length > 0 || files.length > 0) && (
        <motion.div
          className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-8 sm:grid-cols-3 gap-4"
          layout
        >
          <AnimatePresence mode="popLayout">
            {existingFiles.map((file) => (
              <motion.div
                key={file.file_path}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative aspect-square group"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="absolute inset-0 rounded-xl border border-base-200 overflow-hidden bg-base-200/50">
                  {getFilePreview(file, true)}
                </div>

                <motion.button
                  className="absolute -top-2 -right-2 btn btn-circle btn-error btn-sm opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => removeExistingFile(e, file)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4" />
                </motion.button>

                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-xs truncate px-2 py-1 rounded-lg bg-base-100/50 backdrop-blur-sm">
                    {file.file_name}
                  </p>
                </div>
              </motion.div>
            ))}

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

                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-xs truncate px-2 py-1 rounded-lg bg-base-100/50 backdrop-blur-sm">
                    {file.name}
                  </p>
                </div>
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
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {mounted && selectedImageIndex !== -1 && (
        <ImageGalleryDialog
          images={getAllImages()}
          initialIndex={selectedImageIndex}
          isOpen={selectedImageIndex !== -1}
          onClose={() => setSelectedImageIndex(-1)}
        />
      )}
    </div>
  );
};

export default FilePreview;
