"use client";

import { useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
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
import axios from "axios";

export default function ExperienceEditPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useParams<{ id: string }>();
  const pathname = usePathname();
  const id = Number(params.id);
  const [form, setForm] = useState<
    | (CreateActivityRequest & {
        subImages?: { id: number; imageUrl: string }[];
      })
    | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [dateSectionKey, setDateSectionKey] = useState(0);

  // 기존 체험 데이터 불러오기
  const { data, isLoading } = useQuery<
    CreateActivityRequest & {
      id: number;
      subImages?: { id: number; imageUrl: string }[];
    }
  >({
    queryKey: ["activityDetail", id],
    queryFn: async () => {
      const res = await api.get<
        CreateActivityRequest & {
          id: number;
          subImages?: { id: number; imageUrl: string }[];
        }
      >(`/activities/${id}`);
      return res;
    },
    enabled: !Number.isNaN(id),
  });

  useEffect(() => {
    if (!data || form) return;
    const t = setTimeout(() => {
      setForm({
        ...data,
        subImages: data.subImages ?? [], // subImages 존재 안 하면 빈 배열로 초기화
      });
    }, 0);
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
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ?? "수정 중 오류가 발생했습니다.";
        alert(message);
        //activityDetail 최신화
        queryClient.invalidateQueries({ queryKey: ["activityDetail", id] });

        //DateSection 리렌더 유도
        setDateSectionKey((prev) => prev + 1);

        //form의 schedules를 새로 세팅 (기존 data 기반)
        if (data?.schedules) {
          setForm((prev) => ({
            ...prev!,
            schedules: [...(data.schedules as Slot[])],
          }));
        }
      } else {
        alert("알 수 없는 오류가 발생했습니다.");
      }
    },
  });
  const handleChange = <
    K extends keyof (CreateActivityRequest & {
      subImages?: { id?: number; imageUrl: string }[];
    }),
  >(
    key: K,
    value: (CreateActivityRequest & {
      subImages?: { id?: number; imageUrl: string }[];
    })[K],
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

    // 스케줄 로직
    const originalSchedules = (data?.schedules ?? []) as Slot[];

    const schedulesToAdd = (form.schedules as Slot[])
      .filter((s) => !s.id)
      .map((s) => ({
        date: s.date,
        startTime: s.startTime.slice(0, 5),
        endTime: s.endTime.slice(0, 5),
      }));

    const scheduleIdsToRemove =
      originalSchedules
        .filter(
          (orig) => !(form.schedules as Slot[]).some((s) => s.id === orig.id),
        )
        .map((s) => s.id!) ?? [];

    // 서브 이미지 로직 (id와 imageUrl 둘 다 존재)
    const originalSubImages = data?.subImages ?? [];
    const currentSubImages = form.subImages ?? [];

    // 추가된 이미지: id가 없고 imageUrl이 존재하는 경우
    const subImageUrlsToAdd = currentSubImages
      .filter((img) => !img.id && img.imageUrl)
      .map((img) => img.imageUrl);

    // 삭제된 이미지: 원래 있던 id가 현재에는 없는 경우
    const subImageIdsToRemove = originalSubImages
      .filter((orig) => !currentSubImages.some((img) => img.id === orig.id))
      .map((img) => img.id);

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

  const safePush = (url: string) => {
    if (isDirty) {
      setPendingUrl(url);
      setIsLeaveModalOpen(true);
    } else {
      router.push(url);
    }
  };

  useEffect(() => {
    if (!isDirty) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      Object.defineProperty(e, "returnValue", {
        configurable: true,
        value: "",
      });
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    // 뒤로가기(라우터 pop) 감지
    const handlePop = (e: PopStateEvent) => {
      e.preventDefault();
      setPendingUrl("/mypage/experience");
      setIsLeaveModalOpen(true);
      history.pushState(null, "", pathname); // 스택 복원
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

    window.addEventListener("popstate", handlePop);
    document.addEventListener("click", handleLinkClick, true);
    history.pushState(null, "", window.location.href);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePop);
      document.removeEventListener("click", handleLinkClick);
    };
  }, [isDirty, pathname]);

  const handleLeaveConfirm = () => {
    setIsLeaveModalOpen(false);
    router.push(pendingUrl || "/mypage/experience");
  };

  const handleLeaveCancel = () => {
    setPendingUrl(null);
    setIsLeaveModalOpen(false);

    router.push(pathname);
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
            className="w-full rounded-2xl border border-border-default px-4 py-3 typo-14-m text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary h-[140px] md:h-[200px]"
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
            key={dateSectionKey}
            value={form.schedules as Slot[]}
            onChange={(schedules) => handleChange("schedules", schedules)}
          />
        </div>

        {/* 배너 이미지 */}
        <div className="mb-6">
          <div className="mb-2 typo-16-b text-gray-950">배너 이미지 등록</div>
          <PhotoSection
            limit={1}
            value={form.bannerImageUrl ? [form.bannerImageUrl] : []}
            onChange={(urls) => handleChange("bannerImageUrl", urls[0] ?? "")}
          />
        </div>

        {/* 소개 이미지 (subImages) */}
        <div className="mb-10">
          <div className="mb-2 typo-16-b text-gray-950">소개 이미지 등록</div>
          <PhotoSection
            limit={4}
            // PhotoSection은 string[]을 받기 때문에 imageUrl만 추출
            value={form.subImages?.map((img) => img.imageUrl) ?? []}
            onChange={(urls) => {
              const updatedSubImages = urls.map((url) => {
                const existing = form.subImages?.find(
                  (img) => img.imageUrl === url,
                );
                return existing ?? { id: undefined, imageUrl: url };
              });
              handleChange("subImages", updatedSubImages);
            }}
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
