"use client";

import React, { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { CreatePost } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { UploadButton } from "@/lib/uploadthing";
import { toast } from "sonner";
import { createPost } from "@/lib/actions";
import useMount from "@/hooks/useMount";
import TextInput from "@/components/InputFields/TextInput";
import { Label } from "@/components/ui/label";
import dynamic from "next/dynamic";

function WritePage() {
  const TextEditor = useMemo(
    () => dynamic(() => import("@/components/TextEditor"), { ssr: false }),
    []
  );

  const router = useRouter();
  const mount = useMount();
  const [blogData, setBlogData] = useState<z.infer<typeof CreatePost>>({
    fileUrl: "",
    title: "",
    content: "",
    published: false,
    summary: "",
    slug: "",
  });
  const form = useForm<z.infer<typeof CreatePost>>({
    resolver: zodResolver(CreatePost),
    defaultValues: {
      fileUrl: undefined,
      title: "",
      content: undefined,
      published: false,
      summary: "",
    },
  });

  const fileUrl = form.watch("fileUrl");

  if (!mount) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const datas = {
        fileUrl: blogData.fileUrl,
        title: blogData.title,
        content: blogData.content,
        published: false,
        summary: blogData.summary,
        slug: blogData.title
          .toLowerCase()
          .trim()
          .split(/\s+/)
          .join("-")
          .replace(/[^a-zA-Z0-9-\u0900-\u097F]+/g, ""),
      };
      const response = await createPost(datas);
      if (response) {
        toast.success("Post created successfully");
        router.push("/");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create post");
    }
  };

  const handleEditorChange = (content: string) => {
    setBlogData({ ...blogData, content });
    // You can also save the content to the state or send it to an API
  };

  return (
    // <Dialog open={isCreatePage} onOpenChange={(open) => !open && router.back()}>
    //   <DialogContent>
    //     <DialogHeader>
    //       <DialogTitle>Create new post</DialogTitle>
    //     </DialogHeader>

    //       {/* <input type="submit" value={"Create Post"} /> */}
    //     </form>
    //   </DialogContent>
    // </Dialog>

    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {!!fileUrl ? (
          <div className="h-96 md:h-[450px] overflow-hidden rounded-md">
            <AspectRatio ratio={1 / 1} className="relative h-full">
              <Image
                src={fileUrl}
                alt="Post preview"
                fill
                className="rounded-md object-cover"
              />
            </AspectRatio>
          </div>
        ) : (
          <>
            <Label htmlFor="fileUrl">Picture</Label>
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                form.setValue("fileUrl", res[0].url);
                toast.success("Upload complete");
                setBlogData({
                  ...blogData,
                  fileUrl: res[0].url,
                });
              }}
              onUploadError={(error: Error) => {
                console.error(error);
                toast.error("Upload failed");
              }}
            />
          </>
        )}

        <TextInput
          label="Title"
          classNames=" text-sm"
          type={"text"}
          placeholder="Enter Title"
          name="title"
          onChange={(value: any) => setBlogData({ ...blogData, title: value })}
          required={true}
        />

        <TextInput
          label="Summary"
          classNames=" text-sm"
          type={"text"}
          placeholder="Summary of the post"
          name="summary"
          onChange={(value: any) =>
            setBlogData({ ...blogData, summary: value })
          }
          required={true}
        />

        {/* <input
              type="text"
              onChange={(e) =>
                setBlogData({ ...blogData, title: e.target.value })
              }
              value={blogData.title}
            /> */}

        <TextEditor onChange={handleEditorChange} />

        <Button>Submit</Button>
      </form>
    </div>
  );
}

export default WritePage;
