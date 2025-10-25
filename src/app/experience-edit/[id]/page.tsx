"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Modal from "@/components/Modal";
import Input from "@/components/Input";
import Button from "@/components/Button";
import CategorySelect from "@/app/mypage/experience/components/CategorySelect";
import AddressInput from "@/app/mypage/experience/components/AddressInput";
import DateSection, {
  Slot,
} from "@/app/mypage/experience/components/DateSection";
import PhotoSection from "@/app/mypage/experience/components/PhotoSection";
import {
  CreateActivityRequest,
  UpdateActivityRequest,
  ActivitiesResponse,
} from "@/types/experience";
import Image from "next/image";
import warning from "@/assets/img/warning_state.png";
import api from "@/utils/api";
import { updateActivity } from "@/app/mypage/experience/api/activities";

export default function ExperienceEditPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const [form, setForm] = useState<CreateActivityRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // ✅ 기존 체험 데이터 불러오기
  const { data, isLoading } = useQuery({
    queryKey: ["activityDetail", id],
    queryFn: async (): Promise<CreateActivityRequest & { id: number }> => {
      const res = await api.get(`/activities/${id}`);
      return res as CreateActivityRequest & { id: number };
    },
    enabled: !Number.isNaN(id),
  });

  useEffect(() => {
    if (!data) return;
    if (form) return; // 이미 편집 중이면 덮어쓰기 금지
    const t = setTimeout(() => setForm(data), 0);
    return () => clearTimeout(t);
  }, [data, form]);

  const mutation = useMutation({
    mutationFn: async (payload: UpdateActivityRequest) =>
      updateActivity(id, payload),
    onSuccess: (updated) => {
      queryClient.setQueryData<ActivitiesResponse | undefined>(
        ["myActivities"],
        (oldData) => {
          if (!oldData?.activities) return oldData;
          return {
            ...oldData,
            activities: oldData.activities.map((a) =>
              a.id === updated.id ? { ...a, ...updated } : a,
            ),
          };
        },
      );

      queryClient.invalidateQueries({ queryKey: ["myActivities"] });
      queryClient.invalidateQueries({ queryKey: ["activityDetail", id] });

      setIsModalOpen(true);
      setIsDirty(false);
    },
  });

  const handleChange = (
    key: keyof CreateActivityRequest,
    value: string | number | string[] | CreateActivityRequest["schedules"],
  ) => {
    if (!form) return;
    setIsDirty(true);
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

    // ✅ 원본 데이터에서 기존 스케줄 ID 수집
    const originalSchedules = (data?.schedules ?? []) as Slot[];

    // ✅ 새로 추가된 일정 (id가 없는 경우)
    const schedulesToAdd = (form.schedules as Slot[])
      .filter((s) => !s.id)
      .map((s) => ({
        date: s.date,
        startTime: s.startTime.slice(0, 5),
        endTime: s.endTime.slice(0, 5),
      }));

    // ✅ 삭제된 일정 (원본에 있었지만 현재 form에는 없는 경우)
    const scheduleIdsToRemove =
      originalSchedules
        .filter(
          (orig) => !(form.schedules as Slot[]).some((s) => s.id === orig.id),
        )
        .map((s) => s.id!) ?? [];

    // ✅ 이미지 관련도 동일 로직
    const originalSubImages = data?.subImageUrls ?? [];
    const subImageUrlsToAdd =
      form.subImageUrls?.filter((url) => !originalSubImages.includes(url)) ??
      [];
    const subImageIdsToRemove =
      originalSubImages
        .filter((url) => !form.subImageUrls?.includes(url))
        .map((_, i) => i) ?? [];

    const payload: UpdateActivityRequest = {
      title: form.title,
      category: form.category,
      description: form.description,
      price: form.price,
      address: form.address,
      bannerImageUrl: form.bannerImageUrl,
      subImageUrlsToAdd,
      subImageIdsToRemove,
      schedulesToAdd,
      scheduleIdsToRemove,
    };

    console.log("🧾 PATCH payload:", payload);
    mutation.mutate(payload);
  };

  const handleModalConfirm = () => {
    setIsModalOpen(false);
    safePush("/mypage/experience");
  };

  // ✅ 안전 이동 (폼 변경 시 확인)
  const safePush = (url: string) => {
    if (isDirty) {
      setPendingUrl(url);
      setIsLeaveModalOpen(true);
    } else {
      router.push(url);
    }
  };

  // ✅ 페이지 이탈 감지
  useEffect(() => {
    if (!isDirty) return;

    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      setPendingUrl("/mypage/experience");
      setIsLeaveModalOpen(true);
    };

    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      )
        return;

      e.preventDefault();
      setPendingUrl(href);
      setIsLeaveModalOpen(true);
    };

    window.addEventListener("popstate", handlePopState);
    document.addEventListener("click", handleLinkClick, true);
    history.pushState(null, "", window.location.href);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener("click", handleLinkClick);
    };
  }, [isDirty]);

  const handleLeaveConfirm = () => {
    setIsLeaveModalOpen(false);
    router.push(pendingUrl || "/mypage/experience");
  };

  const handleLeaveCancel = () => {
    setPendingUrl(null);
    setIsLeaveModalOpen(false);
  };

  const SAMPLE_OPTIONS = [
    { label: "문화 · 예술", value: "문화 · 예술" },
    { label: "식음료", value: "식음료" },
    { label: "투어", value: "투어" },
    { label: "관광", value: "관광" },
    { label: "웰빙", value: "웰빙" },
  ];

  if (isLoading || !form) return <p>로딩 중...</p>;

  return (
    <main className="flex justify-center px-6">
      <div className="w-full max-w-[700px] mt-12">
        <h3 className="mb-6 typo-18-b">내 체험 수정</h3>

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
            value={form.schedules as Slot[]}
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

        {/* 이탈 확인 모달 */}
        <Modal
          open={isLeaveModalOpen}
          title=""
          confirmText="예"
          cancelText="아니오"
          onConfirm={handleLeaveConfirm}
          onClose={handleLeaveCancel}
        >
          <div className="text-center">
            <Image
              src={warning}
              alt="경고"
              width={80}
              height={80}
              className="mx-auto mb-4"
            />
            <p className="text-gray-950">
              저장되지 않았습니다. <br />
              정말 페이지를 벗어나시겠습니까?
            </p>
          </div>
        </Modal>
      </div>
    </main>
  );
}
