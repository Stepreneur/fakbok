"use client"
import { X } from "lucide-react";
import Image from "next/image";

export default function ImageModal({ isOpen, onClose, imageSrc }) {
  if (!isOpen || !imageSrc) return null;

  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4">
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center hover:bg-white/30 transition-colors z-10"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Image */}
        <div className="relative w-full h-full flex items-center justify-center">
          <Image 
            src={imageSrc}
            alt="Full size image"
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
        </div>

        {/* Click outside to close */}
        <div 
          className="absolute inset-0 -z-10"
          onClick={onClose}
        />
      </div>
    </div>
  );
} 