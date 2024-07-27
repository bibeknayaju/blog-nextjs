"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import TextInput from "@/components/InputFields/TextInput";
import { Label } from "@/components/ui/label";
import dynamic from "next/dynamic";
import ContentDisplay from "@/components/ContentDisplay";

const TextEditor = dynamic(() => import("@/components/TextEditor"), {
  ssr: false,
});

function WritePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [blogData, setBlogData] = useState<z.infer<typeof CreatePost>>({
    fileUrl: "",
    title: "",
    content: "",
    summary: "",
  });

  const form = useForm<z.infer<typeof CreatePost>>({
    resolver: zodResolver(CreatePost),
    defaultValues: {
      fileUrl: "",
      title: "",
      content: "",
      summary: "",
    },
  });

  const fileUrl = form.watch("fileUrl");

  if (!mounted) return null;

  console.log(blogData);

  const handleSubmit = async (data: z.infer<typeof CreatePost>) => {
    try {
      const datas = {
        title: data.title,
        content: data.content,
        summary: data.summary,
        fileUrl: data.fileUrl,
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
    setBlogData((prevData) => ({ ...prevData, content }));
    form.setValue("content", content);
  };

  return (
    <div>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                setBlogData((prevData) => ({
                  ...prevData,
                  fileUrl: res[0].url,
                }));
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
          classNames="text-sm"
          type="text"
          placeholder="Enter Title"
          name="title"
          onChange={(value: string) => {
            form.setValue("title", value);
            setBlogData((prevData) => ({
              ...prevData,
              title: value,
            }));
          }}
          required
        />

        <TextInput
          label="Summary"
          classNames="text-sm"
          type="text"
          placeholder="Summary of the post"
          name="summary"
          onChange={(value: string) => {
            form.setValue("summary", value);
            setBlogData((prevData) => ({
              ...prevData,
              summary: value,
            }));
          }}
          required
        />

        <TextEditor onChange={handleEditorChange} />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          Submit
        </Button>
      </form>

      <ContentDisplay content={form.getValues("content")} />
    </div>
  );
}

export default WritePage;
