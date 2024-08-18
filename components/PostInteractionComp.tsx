"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PostWithExtras } from "@/lib/definitions";
import { PenBoxIcon, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import React from "react";
import SubmitButton from "./SubmitButton";
import { toast } from "sonner";
import { deletePost, updatePost } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import UpdateTextEditor from "./UpdateTextEditor";

function PostInteractionComp({ post }: { post: PostWithExtras }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [title, setTitle] = React.useState(post.title);
  const [content, setContent] = React.useState(post.content);
  const [summary, setSummary] = React.useState(post.summary);

  const handleDelete = async () => {
    try {
      const { message } = await deletePost(post.id);
      toast.success(message);
      router.push("/"); // Client-side redirection
    } catch (error) {
      toast.error("Failed to delete post");
    }
  };
  const newSlug = title
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .join("-")
    .replace(/[^a-zA-Z0-9-\u0900-\u097F]+/g, "");

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission
    const formData = new FormData();
    formData.append("id", post.id);
    formData.append("title", title);
    formData.append("content", content);
    formData.append("summary", summary);
    formData.append("slug", newSlug);
    formData.append("fileUrl", post?.fileUrl || "");

    try {
      const res = await updatePost(formData);
      if (res && res.message) {
        if (res.errors) {
          console.error("Validation errors:", res.errors);
        }
        toast.success(res.message); // Ensure res.message is a string
      }
      // router.push(`/p/${newSlug}`);
    } catch (error) {
      toast.error("Failed to update post");
    }
  };

  return (
    <div>
      {post.author.id === session?.user?.id && (
        <div className="flex gap-3 mb-4 items-center mx-auto w-full justify-center">
          <Dialog>
            <DialogTrigger asChild>
              <PenBoxIcon className="text-blue-500 cursor-pointer " size={20} />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Update Post</DialogTitle>
                <DialogDescription>
                  <form onSubmit={handleUpdate}>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full h-10 p-3 border border-gray-300 rounded-md mb-3"
                    />

                    <input
                      type="text"
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      className="w-full h-10 p-3 border border-gray-300 rounded-md mb-3"
                    />
                    <UpdateTextEditor
                      value={content}
                      onChange={(value) => setContent(value)}
                      // className="w-full h-32 p-3 border border-gray-300 rounded-md mb-3"
                    />

                    <div className="flex gap-3 mt-3 items-center justify-evenly">
                      <Button
                        className="flex-1"
                        variant={"secondary"}
                        onClick={() => router.push("/")}>
                        Cancel
                      </Button>
                      <input
                        value={"Update"}
                        type="submit"
                        className="bg-green-500 text-white h-10 flex justify-center rounded-md flex-1 items-center disabled:cursor-not-allowed w-full p-3"
                      />
                    </div>
                  </form>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Trash className="text-red-500 cursor-pointer" size={20} />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Delete Post</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this post? This action cannot
                  be undone.
                </DialogDescription>
              </DialogHeader>

              <DialogFooter>
                <Button className="flex-1" variant={"secondary"}>
                  Cancel
                </Button>
                <SubmitButton
                  onClick={handleDelete}
                  className="bg-red-500 text-white h-10 flex justify-center rounded-md flex-1 items-center  disabled:cursor-not-allowed w-full p-3">
                  {/* <Button
                    
                    className="bg-red-500 hover:bg-red-600"
                    type="submit"> */}
                  Delete
                  {/* </Button> */}
                  {/* Delete */}
                </SubmitButton>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}

export default PostInteractionComp;
