export type NotificationItem = {
    id: number;
    teamId: string;
    userId: number;
    content: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  };
  
  export type NotificationListResponse = {
    cursorId: number | null;      // 다음 페이지 커서(id) 또는 null(더 없음)
    notifications: NotificationItem[];
    totalCount: number;
  };
  