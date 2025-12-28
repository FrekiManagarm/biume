// source.config.ts
import { defineCollections } from "fumadocs-mdx/config";
import { z } from "zod";
var blogPosts = defineCollections({
  type: "doc",
  dir: "content/blog",
  schema: z.object({
    title: z.string().min(1).max(100),
    description: z.string().min(1).max(100),
    date: z.string().min(1).max(100),
    author: z.string().min(1).max(100),
    tags: z.array(z.string().min(1).max(100))
  })
});
export {
  blogPosts
};
