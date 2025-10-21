"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createActivity } from "@/app/mypage/experience/api/activities";
import { ApiError, CreateActivityRequest } from "@/types/experience";
import Input from "@/components/Input";
import CategorySelect from "@/app/mypage/experience/components/CategorySelect";
import Button from "@/components/Button";
import AddressInput from "@/app/mypage/experience/components/AddressInput";
import DateSection from "../mypage/experience/components/DateSection";
import PhotoSection from "../mypage/experience/components/PhotoSection";
import Modal from "@/components/Modal";
import Image from "next/image";
import warning from "@/assets/img/warning_state.png";

export default function ExperienceRegisterPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [form, setForm] = useState<CreateActivityRequest>({
    title: "",
    category: "",
    description: "",
    address: "",
    price: 0,
    schedules: [{ date: "", startTime: "", endTime: "" }],
    bannerImageUrl: "",
    subImageUrls: [],
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false); // 이탈 확인 모달 상태
  const [pendingUrl, setPendingUrl] = useState<string | null>(null); // 사용자가 가려던 목적지 URL을 잠시 저장해둠
  const [isDirty, setIsDirty] = useState(false); // 작성 중 여부

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: CreateActivityRequest) => createActivity(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myActivities"] });
      setIsDirty(false);
      setIsModalOpen(true);
    },
    onError: (err: unknown) => {
      const apiError = err as ApiError & { response?: { data?: ApiError } };
      const msg =
        apiError?.response?.data?.message ||
        apiError?.message ||
        "등록 중 오류가 발생했습니다.";
      alert(msg);
      console.error("등록 실패:", err);
    },
  });

  const handleSubmit = () => {
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
    mutate(form);
  };

  const handleModalConfirm = () => {
    setIsModalOpen(false);
    safePush("/mypage/experience");
  };

  // 폼 변경 시 dirty 상태 설정
  const handleChange = (
    key: keyof CreateActivityRequest,
    value: string | number | string[] | CreateActivityRequest["schedules"],
  ) => {
    setIsDirty(true);
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // 커스텀 push 함수로 라우터 이동 감지
  const safePush = useCallback(
    (url: string) => {
      if (isDirty) {
        setPendingUrl(url);
        setIsLeaveModalOpen(true);
      } else {
        router.push(url);
      }
    },
    [isDirty, router],
  );

  // 페이지 이탈 감지
  useEffect(() => {
    if (!isDirty) return;

    // 브라우저 뒤로가기 감지
    const handlePopState = () => {
      setPendingUrl(document.referrer || "/");
      setIsLeaveModalOpen(true);
      history.pushState(null, "", window.location.href); // 이동 취소
    };

    // 링크 클릭 감지 (로고, 프로필 등)
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

  // “예” → 이동하려던 페이지로
  const handleLeaveConfirm = () => {
    setIsLeaveModalOpen(false);
    if (pendingUrl) {
      router.push(pendingUrl);
    } else {
      router.push("/mypage/experience");
    }
  };

  // “아니오” → 현재 페이지 유지
  const handleLeaveCancel = () => {
    setPendingUrl(null);
    setIsLeaveModalOpen(false);
  };

  const SAMPLE_OPTIONS = [
    { label: "문화 예술", value: "문화 예술" },
    { label: "식음료", value: "식음료" },
    { label: "투어", value: "투어" },
    { label: "관광", value: "관광" },
    { label: "웰빙", value: "웰빙" },
  ];

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
            label={isPending ? "등록 중..." : "등록하기"}
            variant="primary"
            size="md"
            onClick={() => handleSubmit()}
            disabled={isPending}
          />
        </div>

        {/* 등록 완료 모달 */}
        <Modal
          open={isModalOpen}
          title=" "
          confirmText="확인"
          cancelText=""
          onConfirm={handleModalConfirm}
          onClose={handleModalConfirm}
        >
          <p>체험 등록이 완료되었습니다.</p>
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
              정말 뒤로 가시겠습니까?
            </p>
          </div>
        </Modal>
      </div>
    </main>
  );
}
