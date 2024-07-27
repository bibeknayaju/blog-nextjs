"use client";
import useMount from "@/hooks/useMount";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

function LogoutButton() {
  const router = useRouter();
  const mount = useMount();

  if (!mount) return null;

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <button
      className="bg-red-500 mt-2 text-white px-4 py-2 rounded-md"
      onClick={handleLogout}>
      Logout
    </button>
  );
}

export default LogoutButton;
