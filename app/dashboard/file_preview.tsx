import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

interface FileWithPreview extends File {
  preview: string;
}

const FilePreview: React.FC = () => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
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
      className="inline-flex rounded border border-gray-200 mb-2 mr-2 w-[100px] h-[100px] p-1 box-border"
    >
      <div className="flex min-w-0 overflow-hidden">
        <Image
          src={file.preview}
          className="block w-auto h-full"
          width={100}
          height={100}
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
          alt={file.name}
        />
      </div>
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
            "dropzone border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors",
        })}
      >
        <input {...getInputProps()} />
        <p className="text-gray-600">Click to select files</p>
      </div>
      <aside className="flex flex-row flex-wrap mt-4">{thumbs}</aside>
    </section>
  );
};

export default FilePreview;
