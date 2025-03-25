"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FilePlus2 } from "lucide-react";
import { useFileDropzone } from "@/components/useFileDropzone";
import { handleUpload } from "@/util/uploadCloudinary";

const FilePreview: React.FC<{ setFiles: (files: File[]) => void }> = ({
  setFiles,
}) => {
  const { files, getRootProps, getInputProps } = useFileDropzone();
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});
  const [isUploading, setIsUploading] = useState(false);

  const handleProgressUpdate = (fileName: string, progress: number) => {
    setUploadProgress((prev) => ({
      ...prev,
      [fileName]: progress,
    }));
  };

  const onUploadClick = () => {
    setFiles(files);
    handleUpload(files, handleProgressUpdate, setIsUploading);
  };

  const thumbs = files.map((file) => (
    <div
      key={file.name}
      className="inline-flex flex-col rounded border border-gray-200 mb-2 mr-2 w-[100px] h-[100px] p-1 box-border"
    >
      <div className="flex min-w-0 overflow-hidden">
        <Image
          src={file.preview}
          className="block w-full h-full"
          width={100}
          height={200}
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
          alt={file.name}
        />
      </div>
      {uploadProgress[file.name] !== undefined && (
        <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress[file.name]}%` }}
          />
        </div>
      )}
    </div>
  ));

  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <section className="container bg-base-100">
      <div
        {...getRootProps({
          className:
            "dropzone border-2 border-dashed border-base-200 rounded-lg p-6 cursor-pointer hover:border-base-300 transition-colors flex flex-col items-center justify-center",
        })}
      >
        <input {...getInputProps()} />
        <FilePlus2 size={36} className="text-base-content/60" />
        <p className="text-base-content/60 mt-4">Click to select files</p>
      </div>
      <aside className="flex flex-row flex-wrap mt-4">{thumbs}</aside>
      {files.length > 0 && (
        <button
          onClick={onUploadClick}
          disabled={isUploading}
          className="btn btn-info btn-wide my-8"
        >
          {isUploading ? "Uploading..." : "Upload file"}
        </button>
      )}
    </section>
  );
};

export default FilePreview;
