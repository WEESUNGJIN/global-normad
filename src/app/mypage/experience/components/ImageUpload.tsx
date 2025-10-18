"use client";

import Image from "next/image";
import IconEyeOff from "@/assets/icon/icon_eye_off.svg";

interface ImageUploadProps {
  onChange: (files: File[]) => void; //부모한테 선택한 파일 배열 전달
  limit?: number; // 업로드 가능한 총 개수
  count?: number; // 현재 업로드 된 개수
  disabled?: boolean; // 업로드 비활성화 여부
}

export default function ImageUpload({
  onChange,
  limit = 4,
  count = 0,
  disabled = false,
}: ImageUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const files = Array.from(e.target.files || []).slice(0, limit - count);
    onChange(files);
  };

  return (
    <label
      className={`flex flex-col justify-center items-center w-32 h-32 p-4 gap-3
        bg-white border border-gray-100 rounded-2xl box-border
        shadow-[0_2px_6px_rgba(0,0,0,0.02)]
        transition cursor-pointer
        ${
          disabled
            ? "opacity-40 cursor-not-allowed"
            : "hover:border-primary hover:shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
        }`}
    >
      <input
        type="file"
        accept="image/*"
        multiple={!disabled && limit > 1}
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled}
      />

      <div>
        <Image src={IconEyeOff} alt="icon_eye_off" width={40} height={40} />
      </div>
      <span className="typo-14-m text-gray-600">
        {count}/{limit}
      </span>
    </label>
  );
}
