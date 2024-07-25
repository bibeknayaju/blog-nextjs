// @lib/definitions.ts
import { Post, User, Comment, Like, Tag, Category } from "@prisma/client";

export type CommentWithExtras = Comment & { author: User };
export type LikeWithExtras = Like & { user: User; post: Post; userId: string };
export type TagWithExtras = Tag & { post: Post };
export type CategoriesWithExtras = Category & { post: Post };

export type PostWithExtras = Post & {
  author: User;
  comments: CommentWithExtras[];
  likes: LikeWithExtras[];
  tags: TagWithExtras[];
  categories: CategoriesWithExtras[];
};
