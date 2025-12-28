// @ts-nocheck
import * as __fd_glob_1 from "../content/blog/gestion-temps-therapeute.mdx?collection=blogPosts"
import * as __fd_glob_0 from "../content/blog/example-with-mdx.mdx?collection=blogPosts"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const blogPosts = await create.doc("blogPosts", "content/blog", {"example-with-mdx.mdx": __fd_glob_0, "gestion-temps-therapeute.mdx": __fd_glob_1, });