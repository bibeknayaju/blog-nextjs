import { fetchPosts } from "@/lib/datas";
import React from "react";
import Post from "./Post";

async function PostsGrid() {
  const data = await fetchPosts();

  return (
    <div className="grid mb-10 lg:grid-cols-3  max-w-[90rem] mx-auto space-x-3">
      {data.map((post) => (
        <Post post={post} key={post.id} />
      ))}
    </div>
  );
}

export default PostsGrid;
