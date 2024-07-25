"use client";

import { PostWithExtras, LikeWithExtras } from "@/lib/definitions";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { useState } from "react";
import ActionIcon from "./ActionIcon";
import { likePost } from "@/lib/actions";
import { toast } from "sonner"; // Assuming you are using sonner for notifications
import { User } from "@prisma/client";

function LikeButton({
  post,
  loggedInUser,
}: {
  post: PostWithExtras;
  loggedInUser: User | null;
}) {
  const [likes, setLikes] = useState(post.likes);

  const handleLike = async (postId: string) => {
    if (!loggedInUser) {
      console.error("User ID is undefined");
      return;
    }

    const result = await likePost(postId);

    if (result.message === "Post liked successfully") {
      const newLike: LikeWithExtras = {
        id: "new-like-id", // Assign a temporary id
        postId,
        userId: loggedInUser.id,
        createdAt: new Date(),
        user: loggedInUser, // Actual logged in user object
        post, // The post object itself
      };
      setLikes([...likes, newLike]);
    } else if (result.message === "Post unliked successfully") {
      setLikes(likes.filter((like) => like.userId !== loggedInUser.id));
    }
  };

  const isLiked = loggedInUser
    ? likes.some((like) => like.userId === loggedInUser.id)
    : false;

  return (
    <div className="flex flex-col">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!loggedInUser) {
            toast.error("You need to be logged in to like a post");
          } else {
            await handleLike(post.id);
          }
        }}>
        <input type="hidden" name="postId" value={post.id} />

        <ActionIcon>
          <Heart
            className={cn("h-6 w-6", {
              "text-red-500 fill-red-500": isLiked,
            })}
          />
        </ActionIcon>
      </form>
    </div>
  );
}

export default LikeButton;
