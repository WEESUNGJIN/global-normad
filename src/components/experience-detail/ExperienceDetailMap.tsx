"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import emptyState from "@/assets/img/empty_state.png"; // ← 이미지 경로 맞게 수정하세요

interface ExperienceDetailMapProps {
  address: string;
}

export default function ExperienceDetailMap({
  address,
}: ExperienceDetailMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      loadMap();
      return;
    }

    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${
      process.env.NEXT_PUBLIC_KAKAO_MAP_KEY
    }&autoload=false&libraries=services`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        loadMap();
      });
    };

    function loadMap() {
      if (!window.kakao?.maps?.services || !mapRef.current) {
        setHasError(true);
        return;
      }

      const geocoder = new window.kakao.maps.services.Geocoder();

      geocoder.addressSearch(address, (result: any, status: any) => {
        if (status !== window.kakao.maps.services.Status.OK) {
          console.warn("주소 검색 실패:", status);
          setHasError(true);
          return;
        }

        const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
        const map = new window.kakao.maps.Map(mapRef.current, {
          center: coords,
          level: 3,
        });

        new window.kakao.maps.Marker({
          map,
          position: coords,
        });

        setHasError(false);
      });
    }
  }, [address]);

  return (
    <section className="py-5 md:py-8 border-b border-gray-100">
      <h2 className="typo-16-b md:text-lg text-gray-950 mb-2">오시는 길</h2>

      {!hasError && (
        <p className="typo-14-sb md:text-base text-gray-700 mb-2 md:mb-3">
          {address}
        </p>
      )}

      <div
        ref={mapRef}
        className="w-full h-[23vh] md:h-[40vh] rounded-2xl overflow-hidden flex flex-col items-center justify-center text-gray-500"
      >
        {hasError && (
          <div className="flex flex-col items-center text-center typo-14-m leading-relaxed">
            <Image
              src={emptyState}
              alt="지도 로딩 실패"
              width={120}
              height={120}
            />
            <p>지도를 불러오는 중 문제가 발생했습니다.</p>
            <p>주소를 다시 확인해주세요.</p>
          </div>
        )}
      </div>
    </section>
  );
}
