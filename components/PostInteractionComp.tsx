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
import { deletePost } from "@/lib/actions";
import { useRouter } from "next/navigation";

function PostInteractionComp({ post }: { post: PostWithExtras }) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const { message } = await deletePost(post.id);
      toast(message);
      router.push("/"); // Client-side redirection
    } catch (error) {
      toast.error("Failed to delete post");
    }
  };

  return (
    <div>
      {post.author.id === session?.user?.id && (
        <div className="flex gap-3 mb-4 items-center mx-auto w-full justify-center">
          <button>
            <PenBoxIcon className="text-blue-500" size={20} />
          </button>
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
