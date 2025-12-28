// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  blogPosts: create.doc("blogPosts", {"example-with-mdx.mdx": () => import("../content/blog/example-with-mdx.mdx?collection=blogPosts"), "gestion-temps-therapeute.mdx": () => import("../content/blog/gestion-temps-therapeute.mdx?collection=blogPosts"), }),
};
export default browserCollections;