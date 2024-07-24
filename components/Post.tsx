import { PostWithExtras } from "@/lib/definitions";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function Post({ post }: { post: PostWithExtras }) {
  return (
    <div className="h-fit border border-gray-600 rounded-md">
      <div>
        <Link href={`/post/${post.slug}`} className="h-[16rem]">
          <Image
            width={300}
            height={200}
            className="object-cover w-full h-[15rem]"
            src={post.fileUrl || ""}
            alt={post.title}
          />
        </Link>
        <div className="p-3 flex justify-between items-center">
          <Link href={`/post/${post.slug}`}>
            <h1 className="text-lg font-bold text-gray-800 dark:text-gray-200">
              {post.title}
            </h1>
            <p className="text-sm text-gray-500">{post.summary}</p>
          </Link>

          <div>
            <Heart className="w-5 h-5 cursor-pointer text-red-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
