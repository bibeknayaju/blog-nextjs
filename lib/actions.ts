"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  CreateComment,
  CreatePost,
  DeletePost,
  LikeSchema,
} from "@/lib/schemas";

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

export async function createComment(data: { content: string; postId: string }) {
  const userId = await getUserId();

  const validatedFields = CreateComment.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to create comment",
    };
  }

  const { content, postId } = validatedFields.data;

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) {
    return {
      message: "Post not found",
    };
  }

  try {
    await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: userId,
      },
    });
    revalidatePath(`/`);
    return {
      message: "Comment created successfully",
    };
  } catch (error) {
    console.error("Database Error", error);
    return {
      message: "Database Error: Failed to create comment",
    };
  }
}

// for liking the post
// for liking the post
export async function likePost(postId: string) {
  const userId = await getUserId();

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) {
    return {
      message: "Post not found",
    };
  }

  // Manually check for the like using findFirst
  const like = await prisma.like.findFirst({
    where: {
      postId: postId,
      userId: userId,
    },
  });

  if (like) {
    try {
      await prisma.like.delete({
        where: {
          id: like.id, // Use the id to delete the like
        },
      });

      revalidatePath(`/`);
      return {
        message: "Post unliked successfully",
      };
    } catch (error) {
      console.error("Database Error: Failed to unlike post", error);
      return {
        message: "Database Error: Failed to unlike post",
      };
    }
  } else {
    try {
      await prisma.like.create({
        data: {
          postId,
          userId,
        },
      });

      revalidatePath(`/`);
      return {
        message: "Post liked successfully",
      };
    } catch (error) {
      console.error("Database Error: Failed to like post", error);
      return {
        message: "Database Error: Failed to like post",
      };
    }
  }
}

// for deleting comment
export async function deleteComment(commentId: string) {
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
  });

  if (!comment) {
    return {
      message: "Comment not found",
    };
  }

  try {
    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });

    revalidatePath(`/`);
    return {
      message: "Comment deleted successfully",
    };
  } catch (error) {
    console.error("Database Error", error);
    return {
      message: "Database Error: Failed to delete comment",
    };
  }
}
