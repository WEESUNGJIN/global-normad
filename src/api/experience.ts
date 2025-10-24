"use client";

import api from "@/utils/api";
import type { AxiosError } from "axios";

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

export const searchExperiences = async (
  keyword: string,
): Promise<Experience[]> => {
  try {
    const teamId = process.env.NEXT_PUBLIC_TEAM_ID;
    if (!teamId)
      throw new Error("NEXT_PUBLIC_TEAM_ID가 설정되어 있지 않습니다.");

    const response = await api.get<{ activities: Experience[] }>(
      `${teamId}/activities?method=offset&keyword=${encodeURIComponent(keyword)}`,
    );

    console.log("검색 결과:", response.activities);
    return response.activities;
  } catch (error) {
    console.error("체험 검색 실패:", error);
    throw error;
  }
};

export const fetchPopularExperiences = async (): Promise<Experience[]> => {
  try {
    const teamId = process.env.NEXT_PUBLIC_TEAM_ID;
    if (!teamId)
      throw new Error("NEXT_PUBLIC_TEAM_ID가 설정되어 있지 않습니다.");

    const response = await api.get<{ activities: Experience[] }>(
      `${teamId}/activities?method=offset`,
    );

    const sorted = [...response.activities].sort(
      (a, b) => b.reviewCount - a.reviewCount,
    );

    return sorted;
  } catch (error) {
    const err = error as AxiosError;
    console.error(
      "인기 체험 데이터 불러오기 실패:",
      err.response?.status,
      err.response?.data,
    );
    throw error;
  }
};

export const fetchPopularExperiencesInfinite = async (
  offset: number = 0,
  limit: number = 8,
): Promise<{ activities: Experience[]; nextOffset?: number }> => {
  try {
    const teamId = process.env.NEXT_PUBLIC_TEAM_ID;
    if (!teamId)
      throw new Error("NEXT_PUBLIC_TEAM_ID가 설정되어 있지 않습니다.");

    const url = `${teamId}/activities?method=offset&offset=${offset}&limit=${limit}`;

    const response = await api.get<{ activities: Experience[] }>(url);
    const activities = [...response.activities].sort(
      (a, b) => b.reviewCount - a.reviewCount,
    );

    const nextOffset = activities.length < limit ? undefined : offset + limit;

    return { activities, nextOffset };
  } catch (error) {
    console.error("무한 스크롤 인기 체험 불러오기 실패:", error);
    throw error;
  }
};

export const fetchCategoryActivities = async (
  category?: string,
  sort?: "price_asc" | "price_desc" | "latest",
): Promise<Experience[]> => {
  try {
    const teamId = process.env.NEXT_PUBLIC_TEAM_ID;
    if (!teamId)
      throw new Error("NEXT_PUBLIC_TEAM_ID가 설정되어 있지 않습니다.");

    // 쿼리스트링
    const query = new URLSearchParams({
      method: "offset",
      ...(category ? { category } : {}),
      ...(sort ? { sort } : {}),
    });

    const response = await api.get<{ activities: Experience[] }>(
      `${teamId}/activities?${query.toString()}`,
    );

    console.log("카테고리별 체험 불러오기 성공:", response.activities);
    return response.activities;
  } catch (error) {
    console.error("카테고리별 체험 불러오기 실패:", error);
    throw error;
  }
};
