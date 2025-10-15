"use client";

import React from "react";
import Image from "next/image";

import iconFacebook from "@/assets/icon/icon_facebook.svg";
import iconInstagram from "@/assets/icon/icon_instagram.svg";
import iconYoutube from "@/assets/icon/icon_youtube.svg";
import iconX from "@/assets/icon/icon_X.svg";

export default function Footer() {
  return (
    <footer className="border-t border-border-default bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-[1200px] w-full px-6 py-6 text-text-secondary">
        {/* ✅ 데스크탑 기본: 한 줄 3분할 */}
        <div className="hidden md:flex items-center justify-between">
          {/* 왼쪽 */}
          <p className="typo-12-m">©codeit - 2023</p>

          {/* 가운데 */}
          <div className="flex items-center gap-3 typo-12-m">
            <a href="#">Privacy Policy</a>
            <span>·</span>
            <a href="#">FAQ</a>
          </div>

          {/* 오른쪽 */}
          <div className="flex items-center gap-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <Image src={iconFacebook} alt="Facebook" width={20} height={20} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <Image src={iconInstagram} alt="Instagram" width={20} height={20} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
              <Image src={iconYoutube} alt="YouTube" width={20} height={20} />
            </a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer">
              <Image src={iconX} alt="X" width={20} height={20} />
            </a>
          </div>
        </div>

        {/* ✅ 모바일 전용: 두 줄 구조 */}
        <div className="flex flex-col items-center gap-4 md:hidden">
          {/* 1줄째 */}
          <div className="flex justify-center items-center gap-3 typo-12-m">
            <a href="#">Privacy Policy</a>
            <span>·</span>
            <a href="#">FAQ</a>
          </div>

          {/* 2줄째 */}
          <div className="flex justify-between items-center w-full">
            <p className="typo-12-m">©codeit - 2023</p>
            <div className="flex items-center gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <Image src={iconFacebook} alt="Facebook" width={20} height={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <Image src={iconInstagram} alt="Instagram" width={20} height={20} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                <Image src={iconYoutube} alt="YouTube" width={20} height={20} />
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer">
                <Image src={iconX} alt="X" width={20} height={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}