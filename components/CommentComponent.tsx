import { PostWithExtras } from "@/lib/definitions";
import { MessageCircleMore } from "lucide-react";

function CommentComponent({ post }: { post: PostWithExtras }) {
  return (
    <div className="flex gap-1 items-center">
      <span className="text-gray-300 text-sm font-semibold">
        {post.comments.length}
      </span>
      <MessageCircleMore className={"h-6 w-6 text-gray-300 cursor-pointer"} />
    </div>
  );
}

export default CommentComponent;
