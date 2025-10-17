import api from "@/utils/api";
import { Activity } from "@/types/experience";

export const getMyActivities = async (teamId: number) => {
  return await api.get<{
    cursorId: number;
    totalCount: number;
    activities: Activity[];
  }>(`/${teamId}/my-activities`);
};
