"use client";
import { PostWithExtras } from "@/lib/definitions";
import React, { useEffect } from "react";
import LikeComponent from "./LikeComponent";
import CommentComponent from "./CommentComponent";
import { User } from "@prisma/client";

function FloatingNavbar({
  post,
  loggedInUser,
}: {
  post: PostWithExtras;
  loggedInUser: User | null;
}) {
  const [isScrolled, setIsScrolled] = React.useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return isScrolled ? (
    <div className="fixed bottom-3 left-1/2 transform -translate-x-1/2 z-50 flex items-center justify-center mx-auto rounded-xl mt-2 h-12 px-10 py-2 bg-white/10 dark:bg- border border-white/30 shadow-lg dark:bg-[#0A0A0A]/20 dark:border-gray-700">
      <div className="flex gap-4 items-center shadow-md p-4">
        <LikeComponent loggedInUser={loggedInUser} post={post} />
        <CommentComponent post={post} />
      </div>
    </div>
  ) : null;
}

export default FloatingNavbar;
