import api from "@/utils/api";
import {
  Activity,
  CreateActivityRequest,
  UpdateActivityRequest,
} from "@/types/experience";

// 내 체험 리스트 (GET: /my-activities)
export const getMyActivities = async (): Promise<{
  cursorId?: number;
  totalCount?: number;
  activities: Activity[];
}> => {
  return await api.get("/my-activities");
};

// 내 체험 등록 (POST: /activities)
export const createActivity = async (
  payload: CreateActivityRequest,
): Promise<Activity> => {
  return await api.post("/activities", payload);
};

// 내 체험 수정 (PATCH: /my-activities/{activityId})
export const updateActivity = async (
  activityId: number,
  payload: UpdateActivityRequest,
): Promise<Activity> => {
  return await api.patch(`/my-activities/${activityId}`, payload);
};

// 내 체험 삭제 (DELETE: /my-activities/{activityId})
export const deleteActivity = async (activityId: number): Promise<void> => {
  await api.delete(`/my-activities/${activityId}`);
};

// 이미지 업로드 API 추가
export const uploadActivityImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await api.post<{ activityImageUrl: string }>(
    `/activities/image`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.activityImageUrl;
};
