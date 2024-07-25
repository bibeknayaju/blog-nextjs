"use client";

import { CreateComment } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import TextInput from "./InputFields/TextInput";
import { Button } from "./ui/button";
import { createComment, deleteComment } from "@/lib/actions";
import { PostWithExtras } from "@/lib/definitions";
import { auth } from "@/auth";
import { User } from "next-auth";
import { MessageSquareWarningIcon, Trash2 } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import SubmitButton from "./SubmitButton";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function CommentForm({
  postId,
  post,
  user,
}: {
  postId: string;
  post: PostWithExtras;
  user: User | null;
}) {
  const form = useForm<z.infer<typeof CreateComment>>({
    resolver: zodResolver(CreateComment),
    defaultValues: {
      content: "",
      postId,
    },
  });

  const [openModal, setOpenModal] = React.useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = React.useState("");

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

  const handleDelete = async () => {
    try {
      const { message } = await deleteComment(commentIdToDelete);
      toast.success(message);
      setOpenModal(false);
    } catch (error) {
      toast.error("Failed to delete comment");
      console.error("Error deleting comment:", error);
    }
  };
  return (
    <div className="flex flex-col w-full mt-10">
      {user ? (
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
      ) : (
        <div className="flex border border-gray-300 items-center py-2 rounded-md justify-center">
          <MessageSquareWarningIcon className="h-5 text-yellow-500 w-5 " />
          <p
            className="text-gray-300 text-sm font-semibold w- text-center  p-2 rounded-md
          ">
            You need to be logged in to comment
          </p>
        </div>
      )}

      <div className="mt-5">
        {post?.comments?.length > 0 &&
          post?.comments?.map((comment) => (
            <div
              key={comment.id}
              className="flex gap-2 my-3 items-center justify-between w-full max-w-7xl mx-auto">
              <div className="flex gap-2 items-center">
                <Image
                  width={30}
                  height={30}
                  src={comment.author.image || ""}
                  alt={comment.author.name || ""}
                  className="rounded-full"
                />
                <span className="text-gray-200 mr-1 text-sm font-semibold">
                  {comment.author.name}
                </span>
                <span className="text-gray-300 text-sm ">
                  {comment.content}
                </span>
              </div>
              {comment.authorId === user?.id && (
                <Dialog
                  open={openModal}
                  onOpenChange={(open) => setOpenModal(open)}>
                  <DialogTrigger asChild>
                    <Trash2
                      onClick={() => {
                        setCommentIdToDelete(comment.id);
                      }}
                      className="h-4 text-red-500 w-4 cursor-pointer"
                    />
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Delete Comment</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this comment? This
                        action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                      <DialogClose asChild>
                        <Button
                          onClick={() => {
                            setOpenModal(false);
                            setCommentIdToDelete("");
                          }}
                          className="flex-1"
                          type="button"
                          variant="secondary">
                          Close
                        </Button>
                      </DialogClose>

                      <SubmitButton
                        onClick={handleDelete}
                        className="bg-red-500 text-white h-10 flex justify-center rounded-md flex-1 items-center disabled:cursor-not-allowed w-full p-3">
                        Delete
                      </SubmitButton>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

export default CommentForm;
