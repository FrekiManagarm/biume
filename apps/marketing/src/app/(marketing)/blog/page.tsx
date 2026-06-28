import { blog } from "@/lib/blog/source";
import { BlogPage } from "@/components/blog";
import { Header } from "@/components/landing/header";
import { Metadata } from "next";
import LandingFooter from "@/components/landing/footer";

export default function Blog() {
  // Get all blog posts from fumadocs
  const posts = blog.getPages().map((post) => ({
    title: post.data.title,
    description: post.data.description,
    date: post.data.date,
    author: post.data.author,
    tags: post.data.tags,
    slug: post.slugs[0] || "",
    readTime: "5 min", // You can calculate this based on content length if needed
  }));

  // Sort posts by date (newest first)
  const sortedPosts = posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <>
      <Header />
      <BlogPage posts={sortedPosts} />
      <LandingFooter />
    </>
  );
}

export const metadata: Metadata = {
  title: "Blog & Actualités - Biume",
  description:
    "Découvrez nos derniers articles sur l'innovation, les bonnes pratiques et l'avenir de la thérapie animale assistée par IA.",
};
