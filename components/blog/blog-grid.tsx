"use client";

import { BlogCard } from "./blog-card";

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

interface BlogGridProps {
  posts: BlogPost[];
}

export function BlogGrid({ posts }: BlogGridProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground text-lg">
          Aucun article disponible pour le moment.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {posts.map((post, index) => (
        <BlogCard key={post.slug} {...post} index={index} />
      ))}
    </div>
  );
}
