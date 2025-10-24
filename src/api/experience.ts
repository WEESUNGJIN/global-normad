"use client";

import api from "@/utils/api";
import type { AxiosError } from "axios";

export interface Experience {
  id: number;
  userId: number;
  title: string;
  description: string;
  category: string;
  price: number;
  address: string;
  bannerImageUrl: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ExperienceResponse {
  cursorId: number;
  totalCount: number;
  activities: Experience[];
}

/* 체험 검색 */
export const searchExperiences = async (
  keyword: string,
): Promise<Experience[]> => {
  try {
    const response = await api.get<ExperienceResponse>(
      `/activities?method=offset&keyword=${encodeURIComponent(keyword)}`,
    );

    console.log("검색 결과:", response.activities.length);
    return response.activities;
  } catch (error) {
    console.error("체험 검색 실패:", error);
    throw error;
  }
};

/* 인기 체험 (최신순 정렬 후 리뷰 수 기준) */
export const fetchPopularExperiences = async (): Promise<Experience[]> => {
  try {
    const response = await api.get<ExperienceResponse>(
      `/activities?method=offset`,
    );

    const sorted = [...response.activities].sort(
      (a, b) => b.reviewCount - a.reviewCount,
    );

    console.log("인기 체험 불러오기 성공:", sorted.length);
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

/* 인기 체험 무한 스크롤 */
export const fetchPopularExperiencesInfinite = async (
  offset: number = 0,
  limit: number = 8,
): Promise<{ activities: Experience[]; nextOffset?: number }> => {
  try {
    const url = `/activities?method=offset&offset=${offset}&limit=${limit}`;
    const response = await api.get<ExperienceResponse>(url);

    const activities = [...response.activities].sort(
      (a, b) => b.reviewCount - a.reviewCount,
    );

    const nextOffset = activities.length < limit ? undefined : offset + limit;

    console.log("무한 스크롤 인기 체험:", activities.length);
    return { activities, nextOffset };
  } catch (error) {
    console.error("무한 스크롤 인기 체험 불러오기 실패:", error);
    throw error;
  }
};

/* 카테고리별 체험 */
export const fetchCategoryActivities = async (
  category?: string,
  sort?: "price_asc" | "price_desc" | "latest",
  offset: number = 0,
  limit: number = 8,
): Promise<{ activities: Experience[]; nextOffset?: number }> => {
  try {
    const query = new URLSearchParams({
      method: "offset",
      ...(category ? { category } : {}),
      ...(sort ? { sort } : {}),
      offset: String(offset),
      limit: String(limit),
    });

    const url = `/activities?${query.toString()}`;
    console.log("요청 URL:", url);

    const response = await api.get<ExperienceResponse>(url);

    console.log(
      "카테고리별 체험 불러오기 성공:",
      response.activities?.length ?? 0,
    );

    const nextOffset =
      response.activities.length < limit ? undefined : offset + limit;

    return {
      activities: response.activities,
      nextOffset,
    };
  } catch (error) {
    console.error("카테고리별 체험 불러오기 실패:", error);
    throw error;
  }
};
