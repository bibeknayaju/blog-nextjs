"use client";
import { PostWithExtras } from "@/lib/definitions";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useTransition } from "react";
import ActionIcon from "./ActionIcon";
import { Like } from "@prisma/client";

function LikeComponent({ post }: { post: PostWithExtras }) {
  const { data: session } = useSession();
  const userId = session?.user?.id ?? "";

  const predicate = (like: Like) =>
    like.userId === userId && like.postId === post.id;

  const [optimisticLikes, setOptimisticLikes] = React.useState<Like[]>(
    post.likes
  );
  const [isPending, startTransition] = useTransition();

  const addOptimisticLike = (newLike: Like) => {
    startTransition(() => {
      setOptimisticLikes((prevLikes) =>
        prevLikes.some(predicate)
          ? prevLikes.filter((like) => like.userId !== userId)
          : [...prevLikes, newLike]
      );
    });
  };

  const handleClick = () => {
    if (optimisticLikes.some(predicate)) {
      // Remove like
      const newLike = optimisticLikes.find(predicate);
      addOptimisticLike({
        userId,
        postId: post.id,
        id: "",
        createdAt: undefined as any,
      });
    } else {
      // Add like
      addOptimisticLike({
        userId,
        postId: post.id,
        id: "",
        createdAt: undefined as any,
      });
    }
  };

  return (
    <div>
      <ActionIcon onClick={handleClick}>
        <Heart
          className={cn("h-6 w-6", {
            "text-red-500 fill-red-500": optimisticLikes.some(predicate),
          })}
        />
      </ActionIcon>
    </div>
  );
}

export default LikeComponent;
