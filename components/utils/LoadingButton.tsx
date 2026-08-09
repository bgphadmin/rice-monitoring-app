"use client";

import React from "react";

interface LoadingButtonProps {
  loading: boolean;
  children: React.ReactNode;
}

export default function LoadingButton({ loading, children }: LoadingButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="flex items-center justify-center gap-2 rounded bg-green-600 px-6 py-2 text-white hover:bg-green-700 disabled:opacity-50"
    >
      {loading ? (
        <>
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          Saving...
        </>
      ) : (
        children
      )}
    </button>
  );
}