"use client";

import useMount from "@/hooks/useMount";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const ThemeNavigate = () => {
  const { theme, setTheme } = useTheme();

  const mount = useMount();

  if (!mount) return null;

  return (
    <div className="whatsapp-container border border-gray-500">
      {theme === "dark" ? (
        <Sun
          onClick={() => setTheme("light")}
          className="w-6 h-6 cursor-pointer"
        />
      ) : (
        <Moon
          onClick={() => setTheme("dark")}
          className="w-6 h-6 cursor-pointer"
        />
      )}
    </div>
  );
};

export default ThemeNavigate;
