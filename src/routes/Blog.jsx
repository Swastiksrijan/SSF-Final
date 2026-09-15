// src/routes/Blog.jsx
import { createFileRoute } from "@tanstack/react-router";
import Blog from "../pages/Blog";
import BlogShareEnhancer from "../components/BlogShareEnhancer";

function BlogRoutePage() {
  return (
    <BlogShareEnhancer>
      <Blog />
    </BlogShareEnhancer>
  );
}

export const Route = createFileRoute("/Blog")({
  component: BlogRoutePage,
});
