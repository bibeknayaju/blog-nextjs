import { z } from "zod";

export const PostSchema = z.object({
  id: z.string(),
  fileUrl: z.string().url(),
  title: z
    .string({ message: "Title must be between 5 and 100 characters long" })
    .trim()
    .min(5)
    .max(100),
  content: z.string(),
  published: z.boolean(),
  summary: z.string().optional(),
  slug: z.string(),
});

// if exclude id
export const CreatePost = PostSchema.omit({ id: true });
export const DeletePost = PostSchema.pick({ id: true });

export const CommentSchema = z.object({
  id: z.string(),
  content: z.string(),
  postId: z.string(),
});

export const CreateComment = CommentSchema.omit({ id: true });

export const LikeSchema = z.object({
  postId: z.string(),
});
