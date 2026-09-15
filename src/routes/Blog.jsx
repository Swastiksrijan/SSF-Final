// src/routes/Blog.jsx
import { createFileRoute } from "@tanstack/react-router";
import Blog from "../pages/Blog";
import BlogShareEnhancer from "../components/BlogShareEnhancer";
import BlogKnowledgeStories from "../components/BlogKnowledgeStories";

function BlogRoutePage() {
  return (
    <BlogShareEnhancer>
      <BlogKnowledgeStories>
        <Blog />
      </BlogKnowledgeStories>
    </BlogShareEnhancer>
  );
}

export const Route = createFileRoute("/Blog")({
  component: BlogRoutePage,
});
