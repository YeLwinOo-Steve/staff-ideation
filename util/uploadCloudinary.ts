import axios from "axios";

interface UploadProgressCallback {
  (fileName: string, progress: number): void;
}

export const uploadToCloudinary = async (
  file: File,
  onProgress: UploadProgressCallback,
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    `${process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}`,
  );
  formData.append("resource_type", "auto");

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_CLOUDINARY_BASE_URL}/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
      formData,
      {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total ?? 0),
          );
          onProgress(file.name, progress);
        },
      },
    );
    return response.data.secure_url;
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
};

export const handleUpload = async (
  files: File[],
  onProgress: UploadProgressCallback,
  setIsUploading: (value: boolean) => void,
) => {
  setIsUploading(true);
  try {
    await Promise.all(
      files.map(async (file) => {
        const cloudinaryUrl = await uploadToCloudinary(file, onProgress);
        console.log("Uploaded:", file.name, cloudinaryUrl);
        return cloudinaryUrl;
      }),
    );
  } catch (error) {
    console.error("Upload failed:", error);
  } finally {
    setIsUploading(false);
  }
};
