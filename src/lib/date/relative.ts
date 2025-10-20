// src/lib/date/relative.ts
export function formatRelativeKorean(iso: string): string {
    const now = new Date();
    const d = new Date(iso);
    const diff = (now.getTime() - d.getTime()) / 1000; // sec
    if (diff < 60) return `${Math.max(1, Math.floor(diff))}초 전`;
    const m = Math.floor(diff / 60);
    if (m < 60) return `${m}분 전`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}시간 전`;
    const days = Math.floor(h / 24);
    if (days < 7) return `${days}일 전`;
    const weeks = Math.floor(days / 7);
    if (weeks < 5) return `${weeks}주 전`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}개월 전`;
    const years = Math.floor(days / 365);
    return `${years}년 전`;
  }