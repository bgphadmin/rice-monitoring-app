// components/SyncUser.tsx (Client Component)
"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export default function SyncUser() {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      fetch("/api/save-user", { method: "POST" });
    }
  }, [user]);

  return null;
}