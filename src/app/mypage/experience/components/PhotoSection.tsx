"use client";

import { useEffect, useState } from "react";
import ImageUpload from "./ImageUpload";
import Image from "next/image";
import IconDelete from "@/assets/icon/icon_delete_button.svg";
import { uploadActivityImage } from "@/app/mypage/experience/api/activities";

interface PhotoSectionProps {
  limit?: number; // 업로드 가능한 이미지 개수 제한
  value?: string[];
  onChange?: (urls: string[]) => void; // 부모에게 현재 이미지 URL배열 전달
}

export default function PhotoSection({
  limit = 4,
  value = [],
  onChange,
}: PhotoSectionProps) {
  const [images, setImages] = useState<string[]>(value ?? []);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setImages((prev) => {
      // 배열 길이나 원소가 완전히 동일하면 업데이트 안 함
      const isSame =
        prev.length === value.length && prev.every((v, i) => v === value[i]);
      return isSame ? prev : value;
    });
  }, [value]);

  // 이미지 업로드 함수 추가
  const uploadImage = async (file: File): Promise<string> => {
    try {
      return await uploadActivityImage(file);
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      throw error;
    }
  };

  const handleUpload = async (newFiles: File[]) => {
    if (images.length >= limit) return;

    setIsUploading(true);
    try {
      // 모든 파일을 순차적으로 업로드
      const uploadPromises = newFiles.map((file) => uploadImage(file));
      const uploadedUrls = await Promise.all(uploadPromises);

      const updated = [...images, ...uploadedUrls].slice(0, limit);
      setImages(updated);
      onChange?.(updated);
    } catch (error) {
      console.error("이미지 업로드 중 오류 발생:", error);
      alert("이미지 업로드에 실패했습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    onChange?.(updated);
  };

  return (
    <div className="flex flex-wrap justify-center sm:justify-start gap-3">
      <ImageUpload
        onChange={handleUpload}
        limit={limit}
        count={images.length}
        disabled={images.length >= limit || isUploading}
      />

      {images.map((src, idx) => (
        <div key={idx} className="relative">
          <div className="relative w-32 h-32 rounded-2xl overflow-hidden border border-gray-200">
            <Image
              src={src}
              alt={`uploaded-${idx}`}
              fill
              className="object-cover"
            />
          </div>
          <button
            type="button"
            onClick={() => handleRemove(idx)}
            className="absolute top-[-8px] right-[-8px] w-7 h-7 flex items-center justify-center 
              bg-gray-950 rounded-full hover:brightness-110 transition"
          >
            <Image src={IconDelete} alt="삭제" width={20} height={20} />
          </button>
        </div>
      ))}
    </div>
  );
}
