"use client";
import React from "react";
import { Moon, PenLine, Sun } from "lucide-react";
import useMount from "@/hooks/useMount";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default function Navbar() {
  const navigate = useRouter();
  const mount = useMount();
  const { data: session } = useSession();
  const userImage = session?.user?.image;
  const userAvatarFallBack = session?.user?.name
    ?.split(" ")
    .map((name) => name.charAt(0))
    .join("");
  if (!mount) return null;

  return (
    <div className="flex mb-20 justify-center">
      <div className="fixed top-2 z-50 flex items-center justify-between w-[60%] rounded-xl mt-2 h-16 px-10 py-2 bg-white/10 backdrop-blur-sm border border-white/30 shadow-lg dark:bg-[#0A0A0A]/20 dark:border-gray-700">
        <Link
          href={"/"}
          className="bg-clip-text cursor-pointer  dark:text-white  text-center font-sans font-bold">
          Blog App
        </Link>
        <div className="flex items-center space-x-5">
          {session?.user && (
            <button
              onClick={() => {
                navigate.push("/write");
              }}
              className="flex gap-2 items-center text-sm text-gray-700 dark:text-gray-300">
              <PenLine className="h-4 w-4" />
              <span>Write</span>
            </button>
          )}

          {session && (
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage src={userImage as string} />
                    <AvatarFallback>{userAvatarFallBack}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>
                    <button
                      onClick={() => {
                        navigate.push("/account");
                      }}>
                      My Account
                    </button>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogoutButton />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
