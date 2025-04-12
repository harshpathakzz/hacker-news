import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type StoryType = "top" | "new" | "best";

export function useStories(type: StoryType) {
  return useQuery({
    queryKey: ["stories", type],
    queryFn: async () => {
      try {
        const ids = await api.getStoryIds(type);
        if (!ids || !Array.isArray(ids)) {
          throw new Error("Failed to fetch story IDs");
        }
        const stories = await Promise.all(
          ids.slice(0, 100).map((id) => api.getStory(id))
        );
        return stories.filter(Boolean);
      } catch (error) {
        console.error("Error fetching stories:", error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}