import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import "dotenv/config";
import { FilePlus2 } from "lucide-react";
import axios from "axios";

interface FileWithPreview extends File {
  preview: string;
}

const FilePreview: React.FC = () => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});
  const [isUploading, setIsUploading] = useState(false);

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "staff-ideate");

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dnudlcxj2/upload`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total ?? 0)
            );
            setUploadProgress((prev) => ({
              ...prev,
              [file.name]: progress,
            }));
          },
        }
      );
      return response.data.secure_url;
    } catch (error) {
      console.error("Upload failed:", error);
      throw error;
    }
  };

  const handleUpload = async () => {
    setIsUploading(true);
    try {
      await Promise.all(
        files.map(async (file) => {
          const cloudinaryUrl = await uploadToCloudinary(file);
          console.log("Uploaded:", file.name, cloudinaryUrl);
        })
      );
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        ) as FileWithPreview[]
      );
    },
  });

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
    <section className="container">
      <div
        {...getRootProps({
          className:
            "dropzone border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-gray-400 transition-colors  flex flex-col items-center justify-center",
        })}
      >
        <input {...getInputProps()} />
        <FilePlus2 size={36} />
        <p className="text-gray-600 mt-4">Click to select files</p>
      </div>
      <aside className="flex flex-row flex-wrap mt-4">{thumbs}</aside>
      {files.length > 0 && (
        <button
          onClick={handleUpload}
          disabled={isUploading}
          className={`btn btn-info btn-wide my-8 ${isUploading ? "loading" : ""}`}
        >
          {isUploading ? "Uploading..." : "Upload file"}
        </button>
      )}
    </section>
  );
};

export default FilePreview;
