import api from "@/utils/api";
import { Activity } from "@/types/experience";

export const getMyActivities = async () => {
  return await api.get<{
    cursorId: number;
    totalCount: number;
    activities: Activity[];
  }>("/my-activities");
};
