"use client";

import Image from "next/image";

export default function ExperienceDetailMap() {
  return (
    <section>
      <div className="py-5 border-b border-gray-100">
        <h2 className="typo-16-b text-gray-950 mb-2">오시는 길</h2>

        <p className="typo-14-sb text-gray-700 mb-2">
          서울 중구 청계천로 100 10F (스트릿댄스 스튜디오)
        </p>

        {/* 지도 API 삽입*/}
        <div className="w-full h-[240px] rounded-2xl overflow-hidden bg-gray-100">
          {/* 카카오 지도나 네이버 지도 iframe 삽입 예정 */}
        </div>
      </div>
    </section>
  );
}
