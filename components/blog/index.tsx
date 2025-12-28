"use client";

import { useState, useMemo } from "react";
import { BlogHero } from "./blog-hero";
import { BlogFilters } from "./blog-filters";
import { BlogGrid } from "./blog-grid";

interface BlogPost {
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  slug: string;
  image?: string;
  readTime?: string;
}

interface BlogPageProps {
  posts: BlogPost[];
}

export function BlogPage({ posts }: BlogPageProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Extract all unique tags from posts
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    posts.forEach((post) => {
      post.tags.forEach((tag) => tagsSet.add(tag));
    });
    return Array.from(tagsSet).sort();
  }, [posts]);

  // Filter posts based on selected tags
  const filteredPosts = useMemo(() => {
    if (selectedTags.length === 0) {
      return posts;
    }
    return posts.filter((post) =>
      selectedTags.some((tag) => post.tags.includes(tag)),
    );
  }, [posts, selectedTags]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20">
      <main>
        <BlogHero />

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            {/* Filters */}
            {allTags.length > 0 && (
              <BlogFilters
                tags={allTags}
                selectedTags={selectedTags}
                onTagsChange={setSelectedTags}
              />
            )}

            {/* Blog Grid */}
            <BlogGrid posts={filteredPosts} />
          </div>
        </section>
      </main>
    </div>
  );
}

export { BlogHero } from "./blog-hero";
export { BlogCard } from "./blog-card";
export { BlogGrid } from "./blog-grid";
export { BlogFilters } from "./blog-filters";
