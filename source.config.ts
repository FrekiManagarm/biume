import { defineCollections } from "fumadocs-mdx/config";
import { z } from "zod";

export const blogPosts = defineCollections({
  type: "doc",
  dir: "content/blog",
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    date: z.string().min(1),
    author: z.string().min(1),
    tags: z.array(z.string().min(1)),
  }),
});
