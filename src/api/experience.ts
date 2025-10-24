// src/api/experience.ts
import api from "@/utils/api";

export interface Experience {
  id: number;
  title: string;
  bannerImageUrl: string;
  rating: number;
  reviewCount: number;
  price: number;
  category: string;
  createdAt: string;
}

export const fetchPopularExperiences = async (): Promise<Experience[]> => {
  try {
    const teamId = process.env.NEXT_PUBLIC_TEAM_ID; // 예: "17-2"
    if (!teamId)
      throw new Error("NEXT_PUBLIC_TEAM_ID가 설정되어 있지 않습니다.");

    // 리뷰 많은 순 정렬
    const response = await api.get<{ activities: Experience[] }>(
      `/${teamId}/activities?sort=reviewCount&order=desc`,
    );

    return response.activities;
  } catch (error) {
    console.error("인기 체험 데이터 불러오기 실패:", error);
    throw error;
  }
};
