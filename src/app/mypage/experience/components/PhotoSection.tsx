"use client";

import { useState } from "react";
import ImageUpload from "./ImageUpload";
import Image from "next/image";
import IconDelete from "@/assets/icon/icon_delete_button.svg";

interface PhotoSectionProps {
  /** 업로드 제한 개수 (ex. 1 → 배너용, 4 → 소개용) */
  limit?: number;
}

export default function PhotoSection({ limit = 4 }: PhotoSectionProps) {
  const [images, setImages] = useState<File[]>([]);

  const handleUpload = (newFiles: File[]) => {
    if (images.length >= limit) return; // 추가 차단

    const combined = [...images, ...newFiles].slice(0, limit);
    setImages(combined);
  };

  const handleRemove = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div
      className={`flex flex-wrap justify-center sm:justify-start gap-3 ${
        limit === 1 ? "flex-row" : "flex-row sm:flex-row"
      }`}
    >
      {/* 업로드 박스 (항상 존재) */}
      <ImageUpload
        onChange={handleUpload}
        limit={limit}
        count={images.length}
        disabled={images.length >= limit} // limit 도달 시 비활성화
      />
      {/* 업로드된 이미지 썸네일 */}
      {images.map((file, idx) => {
        const preview = URL.createObjectURL(file);
        return (
          <div className="relative">
            <div
              key={idx}
              className="relative w-32 h-32 rounded-2xl overflow-hidden 
              shadow-[0_2px_6px_rgba(0,0,0,0.02)] border border-gray-100 border-solid"
            >
              <Image
                src={preview}
                alt={`uploaded-${idx}`}
                fill
                className="object-cover "
              />
            </div>
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="absolute  top-[-8px] right-[-8px] w-7 h-7 flex items-center justify-center 
                bg-gray-950 rounded-full hover:brightness-110 transition  "
            >
              <Image src={IconDelete} alt="삭제" width={20} height={20} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
