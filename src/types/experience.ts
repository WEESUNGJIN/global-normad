// 개별 서브 이미지
export interface SubImage {
  id: number;
  imageUrl: string;
}

// 단일 시간대 (서버에서 내려올 때)
export interface ScheduleTime {
  id: number;
  startTime: string; // "12:00"
  endTime: string; // "13:00"
}

// 날짜 단위 스케줄 (조회 시 서버 구조)
export interface Schedule {
  date: string; // "2025-12-01"
  times: ScheduleTime[]; // 하루에 여러 타임 가능
}

// 내 체험 리스트 (GET: /my-activities)
export interface Activity {
  id: number;
  userId: number;
  title: string;
  description: string;
  category: string;
  price: number;
  address: string;
  bannerImageUrl: string;
  subImages: SubImage[];
  schedules: Schedule[];
  reviewCount: number;
  rating: number;
  createdAt: string;
  updateAt: string;
}

// 내 체험 등록 (POST: /activities)
export interface CreateActivityRequest {
  title: string;
  category: string;
  description: string;
  address: string;
  price: number;
  schedules: {
    date: string;
    startTime: string;
    endTime: string;
  }[];
  bannerImageUrl: string;
  subImageUrls: string[];
}

// 내 체험 수정 (PATCH : /my-activities/{activityId})
export interface UpdateActivityRequest {
  title?: string;
  category?: string;
  description?: string;
  price?: number;
  address?: string;
  bannerImageUrl?: string;
  subImageIdsToRemove?: number[];
  subImageUrlsToAdd?: string[];
  scheduleIdsToRemove?: number[];
  schedulesToAdd?: {
    date: string;
    startTime: string;
    endTime: string;
  }[];
}

// CRUD 에러 공통 통일
export interface ApiError {
  message: string;
}
