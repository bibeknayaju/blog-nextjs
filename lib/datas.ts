"use server";

import prisma from "@/lib/prisma";
import { unstable_noStore as noStore } from "next/cache";
import { PostWithExtras } from "@/lib/definitions";

export async function fetchPosts(): Promise<PostWithExtras[]> {
  noStore();

  try {
    const data = await prisma.post.findMany({
      include: {
        likes: {
          include: {
            user: true,
          },
        },
        author: true,
        comments: {
          include: {
            author: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        categories: true,
        tags: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return data as PostWithExtras[]; // Cast to the correct type
  } catch (error) {
    console.error("Database Error", error);
    throw new Error("Failed to fetch posts");
  }
}

export async function fetchBySlug(
  slug: string
): Promise<PostWithExtras | null> {
  noStore();

  try {
    const data = await prisma.post.findUnique({
      where: {
        slug,
      },
      include: {
        likes: {
          include: {
            user: true,
          },
        },
        author: true,
        comments: {
          include: {
            author: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return data as PostWithExtras;
  } catch (error) {
    console.error("Database Error", error);
    throw new Error("Failed to fetch post");
  }
}

export async function fetchUserPost(userId: string) {
  noStore();

  try {
    const data = await prisma.post.findMany({
      where: {
        authorId: userId,
      },
      include: {
        likes: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return data as PostWithExtras[]; // Cast to the correct
  } catch (error) {
    console.error("Database Error", error);
    throw new Error("Failed to fetch posts");
  }
}
