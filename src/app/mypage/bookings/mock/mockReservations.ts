export type MockReservation = {
  id: number;
  activity: {
    title: string;
    bannerImageUrl: string;
  };
  date: string;
  startTime: string;
  endTime: string;
  status: "pending" | "canceled" | "confirmed" | "declined" | "completed";
  totalPrice: number;
};

const img1 =
  "https://images.unsplash.com/photo-1606112219348-204d7d8b94ee?w=800";
const img2 =
  "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800";

export const mockReservations: MockReservation[] = [
  {
    id: 1,
    activity: { title: "서울 야경 사진 투어", bannerImageUrl: img1 },
    date: "2025-10-01",
    startTime: "18:00",
    endTime: "21:00",
    status: "confirmed",
    totalPrice: 85000,
  },
  {
    id: 2,
    activity: { title: "한강 요트 체험", bannerImageUrl: img1 },
    date: "2025-10-02",
    startTime: "14:00",
    endTime: "17:00",
    status: "pending",
    totalPrice: 120000,
  },
  {
    id: 3,
    activity: { title: "북촌 한옥 마을 투어", bannerImageUrl: img2 },
    date: "2025-10-03",
    startTime: "10:00",
    endTime: "12:00",
    status: "completed",
    totalPrice: 60000,
  },
  {
    id: 4,
    activity: { title: "한옥 요리 클래스", bannerImageUrl: img2 },
    date: "2025-10-04",
    startTime: "11:00",
    endTime: "13:00",
    status: "canceled",
    totalPrice: 90000,
  },
  {
    id: 5,
    activity: { title: "남산 타워 전망 투어", bannerImageUrl: img1 },
    date: "2025-10-05",
    startTime: "19:00",
    endTime: "21:00",
    status: "confirmed",
    totalPrice: 70000,
  },
  {
    id: 6,
    activity: { title: "서울 성곽길 트래킹", bannerImageUrl: img1 },
    date: "2025-10-06",
    startTime: "09:00",
    endTime: "11:00",
    status: "pending",
    totalPrice: 50000,
  },
  {
    id: 7,
    activity: { title: "광장시장 미식 투어", bannerImageUrl: img2 },
    date: "2025-10-07",
    startTime: "12:00",
    endTime: "14:00",
    status: "completed",
    totalPrice: 45000,
  },
  {
    id: 8,
    activity: { title: "인사동 도자기 체험", bannerImageUrl: img2 },
    date: "2025-10-08",
    startTime: "15:00",
    endTime: "17:00",
    status: "declined",
    totalPrice: 70000,
  },
  {
    id: 9,
    activity: { title: "서울 궁궐 야간 탐방", bannerImageUrl: img1 },
    date: "2025-10-09",
    startTime: "19:00",
    endTime: "22:00",
    status: "pending",
    totalPrice: 80000,
  },
  {
    id: 10,
    activity: { title: "홍대 거리 버스킹 투어", bannerImageUrl: img2 },
    date: "2025-10-10",
    startTime: "17:00",
    endTime: "20:00",
    status: "completed",
    totalPrice: 55000,
  },
  // --- 👇 아래로 11~50번까지 패턴 반복 ---
  ...Array.from({ length: 40 }, (_, i) => {
    const id = i + 11;
    const titles = [
      "서울 역사 박물관 투어",
      "이태원 글로벌 미식 체험",
      "강남 커피 로스팅 클래스",
      "잠실 석촌호수 자전거 투어",
      "서울 아트페어 감상 투어",
      "성수 핸드메이드 워크숍",
      "서울 플리마켓 투어",
      "남대문 패션 마켓 투어",
      "한강 피크닉 체험",
      "삼청동 도보 투어",
    ];
    const statuses: MockReservation["status"][] = [
      "pending",
      "canceled",
      "confirmed",
      "declined",
      "completed",
    ];
    const title = titles[i % titles.length];
    const status = statuses[i % statuses.length];
    const date = `2025-11-${(i % 30) + 1}`.padStart(10, "0");
    const startTime = `${9 + (i % 8)}:00`;
    const endTime = `${11 + (i % 8)}:00`;
    const price = 50000 + (i % 5) * 10000;

    return {
      id,
      activity: {
        title,
        bannerImageUrl: i % 2 === 0 ? img1 : img2,
      },
      date,
      startTime,
      endTime,
      status,
      totalPrice: price,
    } as MockReservation;
  }),
];
