import { auth } from "@/auth";
import CommentForm from "@/components/CommentForm";
import FloatingNavbar from "@/components/FloatingNavbar";
import PostInteractionComp from "@/components/PostInteractionComp";
import { fetchBySlug } from "@/lib/datas";
import Image from "next/image";
import React from "react";
import { User } from "@prisma/client";
import ContentDisplay from "@/components/ContentDisplay";

async function PostPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const session = await auth();
  const post = await fetchBySlug(slug);
  const readTime = Math.ceil((post?.content.split(" ").length ?? 0) / 200);

  // Ensure that loggedInUser contains all the necessary properties
  const loggedInUser: User | null = session?.user
    ? {
        id: session.user.id,
        email: session.user.email ?? "", // Ensure email is a string
        password: null,
        name: session.user.name ?? null,
        bio: null,
        website: null,
        gender: null,
        username: session.user.username ?? null,
        image: session.user.image ?? null,
        emailVerified: null,
        createdAt: new Date(), // Placeholder value, replace with actual if available
        updatedAt: new Date(), // Placeholder value, replace with actual if available
      }
    : null;

  return (
    <div className="mt-10">
      <div className="max-w-[70rem] flex flex-col text-center mx-auto ">
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

      <div>
        <span>this is demo</span>
      </div>

      {post && <PostInteractionComp post={post} />}

      <div>
        <img
          className="w-full h-[30rem] object-cover"
          src={post?.fileUrl || ""}
          alt={post?.title}
        />

        {post?.content && (
          <ContentDisplay content={post?.content} />

          // <div className="max-w-3xl mx-auto mt-10">
          //   <div dangerouslySetInnerHTML={{ __html: post?.content }} />
          // </div>
        )}

        {post && (
          <div className="max-w-xl w-full mx-auto">
            <FloatingNavbar loggedInUser={loggedInUser} post={post} />
          </div>
        )}
      </div>

      <div className="max-w-3xl mx-auto mt-10">
        {post && (
          <CommentForm user={loggedInUser} postId={post.id} post={post} />
        )}
      </div>
    </div>
  );
}

export default PostPage;
