"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    router.replace("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={logout}
      className="text-sm text-destructiv cursor-pointer backdrop:blur-sm hover:underline border rounded-md px-2 py-1 text-destructive hover:bg-destructive/10 transition-colors duration-200 hover:scale-105 active:scale-95"
    >
      Logout
    </button>
  );
}
