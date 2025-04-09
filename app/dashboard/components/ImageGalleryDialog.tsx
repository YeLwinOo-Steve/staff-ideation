"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

interface ImageGalleryDialogProps {
  images: { url: string; name: string }[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageGalleryDialog({
  images,
  initialIndex,
  isOpen,
  onClose,
}: ImageGalleryDialogProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 backdrop-blur-lg flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.button
          className="absolute top-4 right-4 btn btn-circle btn-ghost text-white"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="w-6 h-6" />
        </motion.button>

        <motion.div
          className="flex items-center justify-center w-full h-full px-4"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="btn btn-circle btn-ghost text-white absolute left-4"
            onClick={handlePrev}
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <div className="relative max-w-4xl max-h-[80vh] w-full h-full flex items-center justify-center">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="relative w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[currentIndex].url}
                alt={images[currentIndex].name}
                className="object-contain max-h-[80vh]"
                width={1200}
                height={800}
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          </div>

          <button
            className="btn btn-circle btn-ghost text-white absolute right-4"
            onClick={handleNext}
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </motion.div>

        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? "bg-white w-4" : "bg-white/50"
              }`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentIndex(index);
              }}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
} 