"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Modal from "@/components/Modal";
import Input from "@/components/Input";
import Button from "@/components/Button";
import CategorySelect from "@/app/mypage/experience/components/CategorySelect";
import AddressInput from "@/app/mypage/experience/components/AddressInput";
import DateSection from "@/app/mypage/experience/components/DateSection";
import PhotoSection from "@/app/mypage/experience/components/PhotoSection";
import { CreateActivityRequest } from "@/types/experience";
// testImg 나중에 인증 권한 해결 후 지울 예정
import streetdanceImg from "@/assets/img/streetdance_main.png";

const mockActivities: (CreateActivityRequest & { id: number })[] = [
  {
    id: 1,
    title: "트로피컬 피싱 투어",
    category: "투어",
    description: "시원한 바다에서 낚시 체험!",
    address: "제주도 바다",
    price: 89000,
    bannerImageUrl: streetdanceImg.src as string,
    subImageUrls: [],
    schedules: [{ date: "2025-10-25", startTime: "09:00", endTime: "12:00" }],
  },
  {
    id: 2,
    title: "스트릿 댄스 클래스",
    category: "문화 예술",
    description: "현직 댄서에게 배우는 스트릿 댄스!",
    address: "홍대",
    price: 65000,
    bannerImageUrl: streetdanceImg.src as string,
    subImageUrls: [],
    schedules: [{ date: "2025-10-30", startTime: "15:00", endTime: "17:00" }],
  },
];

interface MyActivitiesResponse {
  activities: {
    id: number;
    [key: string]: unknown;
  }[];
}

export default function ExperienceEditPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const [form, setForm] = useState<CreateActivityRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 기존 체험 데이터 불러오기 (지금은 mock, 나중엔 getActivityDetail로 교체)
  const { data, isLoading } = useQuery({
    queryKey: ["activityDetail", id],
    queryFn: async () => {
      const target = mockActivities.find((a) => a.id === Number(id));
      return target!;
      // 나중엔 아래처럼 교체하면 됨:
      // return getActivityDetail(Number(id));
    },
  });

  useEffect(() => {
    if (!data) return;
    // form이 이미 존재하면(유저가 수정 중이면) 덮어쓰지 않도록 함
    setForm((prev) => prev ?? (data as CreateActivityRequest));
  }, [data]);

  const mutation = useMutation({
    mutationFn: async (payload: CreateActivityRequest) => {
      // 나중엔 아래로 교체
      // return updateActivity(Number(id), payload);
      console.log("mock update", payload);
      return { ...payload, id: Number(id) };
    },
    onSuccess: (updated) => {
      // 캐시 즉시 수정
      queryClient.setQueryData<MyActivitiesResponse | undefined>(
        ["myActivities"],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            activities: oldData.activities.map((a) =>
              a.id === updated.id ? { ...a, ...updated } : a,
            ),
          };
        },
      );
      // 서버 데이터 다시 불러오기
      queryClient.invalidateQueries({ queryKey: ["myActivities"] });
      queryClient.invalidateQueries({ queryKey: ["activityDetail", id] });

      setIsModalOpen(true);
    },
  });

  const handleChange = (
    key: keyof CreateActivityRequest,
    value: string | number | string[] | CreateActivityRequest["schedules"],
  ) => {
    if (!form) return;
    setForm((prev) => ({ ...prev!, [key]: value }));
  };

  const handleSubmit = () => {
    if (!form) return;
    if (
      !form.title ||
      !form.category ||
      !form.description ||
      !form.price ||
      !form.address ||
      !form.schedules.length ||
      !form.bannerImageUrl
    ) {
      alert("필수 항목을 입력해 주세요.");
      return;
    }
    mutation.mutate(form);
  };

  const handleModalConfirm = () => {
    setIsModalOpen(false);
    router.push("/mypage/experience");
  };

  const SAMPLE_OPTIONS = [
    { label: "문화 예술", value: "문화 예술" },
    { label: "식음료", value: "식음료" },
    { label: "투어", value: "투어" },
    { label: "관광", value: "관광" },
    { label: "웰빙", value: "웰빙" },
  ];

  if (isLoading || !form) return <p>로딩 중...</p>;

  return (
    <main className="flex justify-center px-6">
      <div className="w-full max-w-[700px] mt-12">
        <h3 className="mb-6 typo-18-b">내 체험 등록</h3>

        {/* 제목 */}
        <div className="mb-6">
          <div className="mb-2 typo-16-b text-gray-950">제목</div>
          <Input
            value={form.title}
            placeholder="제목을 입력해 주세요"
            onChange={(e) => handleChange("title", e.target.value)}
          />
        </div>

        {/* 카테고리 */}
        <div className="mb-6">
          <div className="mb-2 typo-16-b text-gray-950">카테고리</div>
          <CategorySelect
            value={form.category}
            onChange={(v) => handleChange("category", v)}
            options={SAMPLE_OPTIONS}
            placeholder="카테고리를 선택해 주세요"
          />
        </div>

        {/* 설명 */}
        <div className="mb-6">
          <div className="mb-2 typo-16-b text-gray-950">설명</div>
          <textarea
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="체험에 대한 설명을 입력해 주세요"
            className="w-full rounded-2xl border border-border-default px-4 py-3
              typo-14-m text-text-primary placeholder:text-text-secondary/60
              focus:outline-none focus:ring-2 focus:ring-primary
              h-[140px] md:h-[200px]"
          />
        </div>

        {/* 가격 */}
        <div className="mb-6">
          <div className="mb-2 typo-16-b text-gray-950">가격</div>
          <Input
            value={form.price}
            placeholder="체험 금액을 입력해 주세요"
            onChange={(e) => handleChange("price", Number(e.target.value))}
          />
        </div>

        {/* 주소 */}
        <div className="mb-6">
          <div className="mb-2 typo-16-b text-gray-950">주소</div>
          <AddressInput
            value={form.address}
            onChange={(v) => handleChange("address", v)}
          />
        </div>

        {/* 예약 가능한 시간대 */}
        <div className="mb-6">
          <DateSection
            value={form.schedules}
            onChange={(schedules) => handleChange("schedules", schedules)}
          />
        </div>

        {/* 배너 이미지 등록 */}
        <div className="mb-6">
          <div className="mb-2 typo-16-b text-gray-950">배너 이미지 등록</div>
          <PhotoSection
            limit={1}
            value={form.bannerImageUrl ? [form.bannerImageUrl] : []}
            onChange={(urls) => handleChange("bannerImageUrl", urls[0] ?? "")}
          />
        </div>

        {/* 소개 이미지 등록 */}
        <div className="mb-10">
          <div className="mb-2 typo-16-b text-gray-950">소개 이미지 등록</div>
          <PhotoSection
            limit={4}
            value={form.subImageUrls}
            onChange={(urls) => handleChange("subImageUrls", urls)}
          />
        </div>

        <div className="flex justify-center mb-24">
          <Button
            label={mutation.isPending ? "수정 중..." : "수정하기"}
            variant="primary"
            size="md"
            onClick={handleSubmit}
            disabled={mutation.isPending}
          />
        </div>

        {/* 수정 완료 모달 */}
        <Modal
          open={isModalOpen}
          title=" "
          confirmText="확인"
          cancelText=""
          onConfirm={handleModalConfirm}
          onClose={handleModalConfirm}
        >
          <p>수정이 완료되었습니다.</p>
        </Modal>
      </div>
    </main>
  );
}
