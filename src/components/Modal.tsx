"use client";
import React from "react";
import Button from "@/components/Button";
import clsx from "clsx";

interface ModalProps {
  open: boolean;
  title?: string;
  children?: React.ReactNode;
  confirmText?: string;   // 기본: "확인"
  cancelText?: string;    // 비우면 자동으로 취소 버튼 숨김
  onClose?: () => void;
  onConfirm?: () => void;
  showCancel?: boolean;   // 기본 true
}

export default function Modal({
  open,
  title,
  children,
  confirmText = "확인",
  cancelText = "취소",
  onClose,
  onConfirm,
  showCancel = true,
}: ModalProps) {
  if (!open) return null;

  const hasConfirm = Boolean(confirmText?.trim());
  const hasCancel = Boolean(showCancel && cancelText?.trim());
  const isSingle = hasConfirm && !hasCancel;

  // 반응형 폭 (모바일 320px / 데스크탑 400px)
  const widthClass = "w-[320px] sm:w-[400px]";
  // 버튼 래퍼 최대폭 (모바일 260px / 데스크탑 340px)
  const actionsMaxClass = "max-w-[260px] sm:max-w-[340px]";

  // ✅ Actions 영역을 useMemo로 메모이제이션
  const Actions = React.useMemo(() => {
    if (isSingle) {
      return (
        <div className={clsx("mt-6 mx-auto w-full", actionsMaxClass)}>
          <Button
            size="md"
            label={confirmText!}
            onClick={onConfirm}
            className="w-full"
          />
        </div>
      );
    }

    if (hasConfirm && hasCancel) {
      return (
        <div
          className={clsx(
            "mt-6 grid grid-cols-2 gap-3 mx-auto w-full",
            actionsMaxClass
          )}
        >
          <Button
            variant="ghost"
            size="md"
            label={cancelText!}
            onClick={onClose}
            className="w-full"
          />
          <Button
            size="md"
            label={confirmText!}
            onClick={onConfirm}
            className="w-full"
          />
        </div>
      );
    }

    return null;
  }, [isSingle, hasConfirm, hasCancel, confirmText, cancelText, onClose, onConfirm, actionsMaxClass]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* 반투명 배경 */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden
      />

      {/* 모달 본체 */}
      <div
        role="dialog"
        aria-modal="true"
        className={clsx(
          "relative text-center bg-white dark:bg-gray-900 rounded-[24px] shadow-xl border border-border-default p-[30px]",
          widthClass,
          "max-w-[calc(100vw-2rem)]"
        )}
      >
        {/* 제목 */}
        {title && <h3 className="typo-18-b">{title}</h3>}

        {/* 내용 */}
        <div className="mt-3 max-h-[60vh] overflow-y-auto">{children}</div>

        {/* 버튼 */}
        {Actions}
      </div>
    </div>
  );
}
