// @ts-nocheck
import * as __fd_glob_3 from "../content/blog/qu-est-ce-que-biume.mdx?collection=blogPosts"
import * as __fd_glob_2 from "../content/blog/pourquoi-les-professionnels-de-la-sant-animale-doivent-adopter-lia-maintenant-et-pas-dans-5-ans.mdx?collection=blogPosts"
import * as __fd_glob_1 from "../content/blog/gagner-1h-par-jour-grce-un-module-de-rapport-le-secret-des-pros-de-la-sant-animale-intelligent.mdx?collection=blogPosts"
import * as __fd_glob_0 from "../content/blog/digitalisation-comptes-rendus.mdx?collection=blogPosts"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const blogPosts = await create.doc("blogPosts", "content/blog", {"digitalisation-comptes-rendus.mdx": __fd_glob_0, "gagner-1h-par-jour-grce-un-module-de-rapport-le-secret-des-pros-de-la-sant-animale-intelligent.mdx": __fd_glob_1, "pourquoi-les-professionnels-de-la-sant-animale-doivent-adopter-lia-maintenant-et-pas-dans-5-ans.mdx": __fd_glob_2, "qu-est-ce-que-biume.mdx": __fd_glob_3, });