// src/components/auth-detail/LoadingSpinner.tsx

"use client";

interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message }: LoadingSpinnerProps) {
  return (
    <div className="flex h-screen flex-col items-center jsutify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border gray-300 border-t-gray-600" />
      {message && <p className="mt-4 text-gray-600">{message}</p>}
    </div>
  );
}
