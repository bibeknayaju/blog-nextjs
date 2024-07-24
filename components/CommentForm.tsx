"use client";
import { CreateComment } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import TextInput from "./InputFields/TextInput";
import { Button } from "./ui/button";
import { createComment } from "@/lib/actions";
import { PostWithExtras } from "@/lib/definitions";

function CommentForm({
  postId,
  post,
}: {
  postId: string;
  post: PostWithExtras;
}) {
  const form = useForm<z.infer<typeof CreateComment>>({
    resolver: zodResolver(CreateComment),
    defaultValues: {
      content: "",
      postId,
    },
  });

  const handleCreateComment = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const data = {
        content: form.getValues("content").trim(),
        postId,
      };
      if (!data.content) {
        return;
      }
      const response = await createComment(data);
      if (response) {
        form.reset({ content: "" }); // Reset the content field
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <form
        className="flex gap-3 w-full justify-between items-end mb-3"
        onSubmit={handleCreateComment}>
        <div className="flex-1">
          <TextInput
            classNames="w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Write a comment..."
            values={form.watch("content")}
            onChange={(value: string) => form.setValue("content", value)}
            required={true}
          />
        </div>
        <Button
          className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          type="submit"
          disabled={
            form.formState.isSubmitting || !form.watch("content").trim()
          }>
          Submit
        </Button>
      </form>

      {post?.comments?.length > 0 &&
        post?.comments?.map((comment) => (
          <div key={comment.id} className="flex gap-1 my-1 items-center">
            <span className="text-gray-200 text-sm font-semibold">
              {comment.author.name}
            </span>
            <span className="text-gray-300 text-sm ">{comment.content}</span>
          </div>
        ))}
    </div>
  );
}

export default CommentForm;
