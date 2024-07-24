import LikeComponent from "@/components/LikeComponent";
import PostInteractionComp from "@/components/PostInteractionComp";
import { fetchBySlug } from "@/lib/datas";
import Image from "next/image";
import React from "react";

async function PostPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const post = await fetchBySlug(slug);
  console.log(post?.content);
  const readTime = Math.ceil((post?.content.split(" ").length ?? 0) / 200);
  return (
    <div className="max-w-[90rem] flex flex-col text-center mx-auto mt-10">
      <div className="">
        <h4 className="font-bold text-5xl mb-4">{post?.title}</h4>
        {post?.summary && (
          <span className=" font-semibold text-gray-300 text-2xl">
            {post?.summary}
          </span>
        )}

        <div className="flex mx-auto items-center gap-2 text-gray-400 justify-center my-5">
          <Image
            height={40}
            width={40}
            src={post?.author?.image || ""}
            alt=""
          />
          <p>{post?.author?.name}</p>
          {"·"}
          <p>
            {post?.createdAt ? new Date(post.createdAt).toDateString() : ""}
          </p>
          {"·"}
          <p>
            {readTime}
            {" min read"}
          </p>
        </div>
      </div>
      {/* {post && <PostInteractionComp post={post} />} */}
      {post && <PostInteractionComp post={post} />}

      {post && <LikeComponent post={post} />}
      <div>
        <img
          className="w-full h-[30rem] object-cover"
          src={post?.fileUrl || ""}
          alt={post?.title}
        />

        <h1>heading h1</h1>
        <h2>heading h2</h2>
        <h3>heading h3</h3>

        {/* <p className="text-lg text-gray-800 dark:text-gray-200 max-w-3xl mx-auto my-2 text-center relative z-10">
  {post?.content}
</p> */}
        {post?.content && (
          <div className="max-w-3xl mx-auto mt-10">
            <div dangerouslySetInnerHTML={{ __html: post?.content }} />
          </div>
        )}
      </div>
    </div>
  );
}

export default PostPage;
