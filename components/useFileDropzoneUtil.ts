import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface FileDropzoneOptions {
  onDrop?: (acceptedFiles: File[]) => File[] | void;
}

export function useFileDropzoneUtil(options?: FileDropzoneOptions) {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const processedFiles = options?.onDrop
        ? options.onDrop(acceptedFiles)
        : acceptedFiles;
      if (processedFiles) {
        setFiles((currentFiles) => [...currentFiles, ...processedFiles]);
      }
    },
    [options],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-powerpoint": [".ppt"],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        [".pptx"],
    },
  });

  return { files, setFiles, getRootProps, getInputProps };
}
