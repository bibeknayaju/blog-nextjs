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
  UpdatePost,
} from "@/lib/schemas";

import { getUserId } from "./utils";

// this function for creating a post
// this function for creating a post
export async function createPost(values: z.infer<typeof CreatePost>) {
  console.log("values", values);
  // this for getting the userId
  const userId = await getUserId();

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

  const slug = title
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .join("-")
    .replace(/[^a-zA-Z0-9-\u0900-\u097F]+/g, "");
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
        slug,
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    return {
      message: "Database Error: Failed to create post",
    };
  }

  return {
    message: "Post created successfully",
  };
}

// delete the post
export async function deletePost(id: string) {
  const userId = await getUserId();

  const post = await prisma.post.findUnique({
    where: {
      id,
    },
    include: {
      author: true,
      comments: true, // Include comments to delete them later
    },
  });

  if (!post || post.author.id !== userId) {
    throw new Error("Post not found or you are not the author");
  }

  try {
    // Delete all comments related to the post
    await prisma.comment.deleteMany({
      where: {
        postId: id,
      },
    });

    // Now delete the post
    await prisma.post.delete({
      where: {
        id,
      },
    });

    revalidatePath("/");
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

// for updating the post
export async function updatePost(formData: FormData) {
  const userId = await getUserId();

  const validatedFields = UpdatePost.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    content: formData.get("content"),
    slug: formData.get("slug"),
    summary: formData.get("summary"),
    fileUrl: formData.get("fileUrl"),
  });

  if (!validatedFields.success) {
    console.log(
      "Validation errors:",
      validatedFields.error.flatten().fieldErrors
    );
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to update post",
    };
  }

  const { id, title, content, fileUrl, slug, summary } = validatedFields.data;

  const post = await prisma.post.findUnique({
    where: {
      id,
      authorId: userId,
    },
  });

  if (!post) {
    return {
      message: "Post not found",
    };
  }

  try {
    await prisma.post.update({
      where: {
        id,
      },
      data: {
        title,
        content,
        slug,
        summary,
        fileUrl,
      },
    });
    return {
      message: "Post updated successfully",
    };
  } catch (error) {
    console.error("Database Error", error);
    return {
      message: "Database Error: Failed to update post",
    };
  }
}
