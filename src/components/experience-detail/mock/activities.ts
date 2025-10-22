import fjordImg from "@/assets/img/fjord.png";
import coastalvillageImg from "@/assets/img/coastalvillage.png";
import reedforestImg from "@/assets/img/reedforest.png";
import hotairballoonImg from "@/assets/img/hotairballoon.png";
import bicycleImg from "@/assets/img/bicycle.png";
import tropicalfishImg from "@/assets/img/tropicalfish.png";

export interface Activity {
  id: number;
  title: string;
  bannerImageUrl: string;
  rating: number;
  reviewCount: number;
  price: number;
  category: string;
  createdAt: string;
}

export const activities: Activity[] = [
  {
    id: 1,
    title: "피오르 체험",
    bannerImageUrl: fjordImg.src,
    rating: 3.9,
    reviewCount: 108,
    price: 42800,
    category: "관광",
    createdAt: "2025-10-01T09:00:00Z",
  },
  {
    id: 2,
    title: "해안가 마을에서 1주일 살아보기",
    bannerImageUrl: coastalvillageImg.src,
    rating: 2.9,
    reviewCount: 67,
    price: 217000,
    category: "투어",
    createdAt: "2025-09-15T08:00:00Z",
  },
  {
    id: 3,
    title: "부모님과 함께 갈대숲 체험",
    bannerImageUrl: reedforestImg.src,
    rating: 4.0,
    reviewCount: 113,
    price: 6000,
    category: "관광",
    createdAt: "2025-08-10T10:00:00Z",
  },
  {
    id: 4,
    title: "열기구 페스티벌",
    bannerImageUrl: hotairballoonImg.src,
    rating: 4.1,
    reviewCount: 85,
    price: 35000,
    category: "관광",
    createdAt: "2025-08-20T10:00:00Z",
  },
  {
    id: 5,
    title: "베트남 자전거 여행",
    bannerImageUrl: bicycleImg.src,
    rating: 3.9,
    reviewCount: 108,
    price: 42800,
    category: "투어",
    createdAt: "2025-05-01T10:00:00Z",
  },
  {
    id: 6,
    title: "다양한 열대어 구경하기",
    bannerImageUrl: tropicalfishImg.src,
    rating: 4.3,
    reviewCount: 18,
    price: 12000,
    category: "문화·예술",
    createdAt: "2025-03-10T10:00:00Z",
  },
];
