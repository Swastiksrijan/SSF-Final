import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const router = createRouter({
  routeTree,
  scrollRestoration: true,
  // Chunk names change on every deploy; without this an open tab can still hold
  // a preloaded route pointing at a now-deleted chunk and throw
  // "Failed to fetch dynamically imported module" until a manual refresh.
  defaultPreloadStaleTime: 0,
});
