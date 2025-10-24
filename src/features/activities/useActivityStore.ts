// src/features/activities/useActivityStore.ts
import { create } from "zustand";
import { fetchPopularExperiences, Experience } from "@/api/experience";

interface ActivityStore {
  activities: Experience[];
  fetchActivities: () => Promise<void>;
}

export const useActivityStore = create<ActivityStore>((set) => ({
  activities: [],
  fetchActivities: async () => {
    try {
      const data = await fetchPopularExperiences();
      set({ activities: data });
    } catch (err) {
      console.error("체험 데이터 로드 실패:", err);
    }
  },
}));
