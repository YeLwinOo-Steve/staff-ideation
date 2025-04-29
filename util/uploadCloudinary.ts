import axios from "axios";

export async function uploadToCloudinary(
  file: File,
  userName?: String,
  onProgress?: (progress: number) => void,
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    `${process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}`,
  );
  if (userName) {
    formData.append(
      "folder",
      `user_uploads/${userName.toLowerCase().replace(/\s+/g, "_")}`,
    );
  }

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_CLOUDINARY_BASE_URL}/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const progress = (progressEvent.loaded / progressEvent.total) * 100;
            onProgress(progress);
          }
        },
      },
    );

    return response.data.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
}

export const handleUpload = async (
  files: File[],
  onProgress: (progress: number) => void,
  setIsUploading: (value: boolean) => void,
  userName?: String,
) => {
  setIsUploading(true);
  try {
    await Promise.all(
      files.map(async (file) => {
        const cloudinaryUrl = await uploadToCloudinary(
          file,
          userName,
          onProgress,
        );
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
