"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { CreatePost, DeletePost } from "@/lib/schemas";

import { getUserId } from "./utils";

// this function for creating a post
export async function createPost(values: z.infer<typeof CreatePost>) {
  console.log("values", values);
  // this for getting the userId
  const userId = await getUserId();
  console.log("userId", userId);

  // this for validating the fields,
  const validatedFields = CreatePost.safeParse(values);

  // this for checking if the fields are validated
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to create post",
    };
  }

  // this for extracting the fields from the validatedFields
  const { fileUrl, content, title, summary } = validatedFields.data;

  console.log("data", validatedFields.data);
  // this logic for creating a post
  try {
    await prisma.post.create({
      data: {
        content,
        title,
        summary: summary || "",
        fileUrl,
        author: {
          connect: {
            id: userId,
          },
        },
        slug: title
          .toLowerCase()
          .trim()
          .split(/\s+/)
          .join("-")
          .replace(/[^a-zA-Z0-9-\u0900-\u097F]+/g, ""),
      },
    });
  } catch (error) {
    return {
      message: "Database Error: Failed to create post",
    };
  }

  revalidatePath("/");
  redirect("/");
}

// delete the post
export async function deletePost(id: string) {
  const userId = await getUserId();

  const post = await prisma.post.findUnique({
    where: {
      id,
      author: {
        id: userId,
      },
    },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  try {
    await prisma.post.delete({
      where: {
        id,
      },
    });

    revalidatePath("/");
    // redirect("/"); // This is server-side redirection
    return { message: "Post Deleted Successfully" };
  } catch (error) {
    console.error("Database Error", error);
    throw new Error("Database Error: Failed to delete post");
  }
}
