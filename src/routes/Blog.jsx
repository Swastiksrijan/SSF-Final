// src/routes/Blog.jsx
import { createFileRoute } from "@tanstack/react-router";
import Blog from "../pages/Blog";
import BlogShareEnhancer from "../components/BlogShareEnhancer";
import SingleKnowledgeStory from "../components/SingleKnowledgeStory";
import BlogKnowledgeStories from "../components/BlogKnowledgeStories";

function BlogRoutePage() {
  return (
    <BlogShareEnhancer>
      <div className="pt-28 bg-black min-h-screen text-white px-4">
        <SingleKnowledgeStory />
        <BlogKnowledgeStories>
          <Blog />
        </BlogKnowledgeStories>
      </div>
    </BlogShareEnhancer>
  );
}

export const Route = createFileRoute("/Blog")({
  component: BlogRoutePage,
});
