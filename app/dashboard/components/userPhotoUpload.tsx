"use client";

import Image from "next/image";
import { Upload } from "lucide-react";
import { useState, useEffect } from "react";

interface UserPhotoUploadProps {
  initialPhoto?: string | null;
  onPhotoChange: (file: File | null) => void;
}

const UserPhotoUpload = ({
  initialPhoto,
  onPhotoChange,
}: UserPhotoUploadProps) => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    initialPhoto || null,
  );

  useEffect(() => {
    if (initialPhoto) {
      setPhotoPreview(initialPhoto);
    }
  }, [initialPhoto]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onPhotoChange(file);

      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full md:w-1/3 flex flex-col items-center">
      <div className="avatar mb-4">
        <div className="w-32 h-32 mask mask-squircle bg-base-300 flex items-center justify-center relative overflow-hidden">
          {photoPreview ? (
            <Image
              src={photoPreview}
              alt="user avatar preview"
              width={128}
              height={128}
            />
          ) : (
            <Upload
              size={32}
              className="text-base-content opacity-40 absolute inset-0 m-auto"
            />
          )}
        </div>
      </div>
      <div className="form-control w-full">
        <input
          type="file"
          className="file-input file-input-bordered w-full"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default UserPhotoUpload;
