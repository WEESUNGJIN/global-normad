export interface Activity {
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
  activities: Activity[];
}

export const experienceMockData: ExperienceResponse = {
  cursorId: 0,
  totalCount: 3,
  activities: [
    {
      id: 1,
      userId: 101,
      title: "핸드드립 커피 클래스",
      description:
        "바리스타에게 직접 배우는 원데이 핸드드립 클래스 ☕️ 원두 선택부터 추출까지 실습 중심으로 진행됩니다.",
      category: "음식/음료",
      price: 45000,
      address: "서울시 마포구 연남동",
      bannerImageUrl: "",
      rating: 4.9,
      reviewCount: 58,
      createdAt: "2025-10-10T14:00:00.000Z",
      updatedAt: "2025-10-12T18:30:00.000Z",
    },
    {
      id: 2,
      userId: 101,
      title: "캔들 메이킹 클래스",
      description:
        "자신만의 향을 담은 소이캔들을 만들어보세요. 향 조합과 디자인을 직접 선택할 수 있습니다.",
      category: "공예",
      price: 38000,
      address: "서울시 성동구 성수동",
      bannerImageUrl: "",
      rating: 4.7,
      reviewCount: 32,
      createdAt: "2025-10-09T15:00:00.000Z",
      updatedAt: "2025-10-12T10:00:00.000Z",
    },
    {
      id: 3,
      userId: 101,
      title: "플라워 원데이 클래스",
      description:
        "계절 꽃으로 부케를 만들어보는 감성 플라워 클래스 🌸 초보자도 쉽게 따라 할 수 있어요.",
      category: "플라워",
      price: 55000,
      address: "서울시 강남구 논현동",
      bannerImageUrl: "",
      rating: 4.8,
      reviewCount: 41,
      createdAt: "2025-10-08T12:00:00.000Z",
      updatedAt: "2025-10-13T09:00:00.000Z",
    },
  ],
};
