"use client";

import { formatDistanceToNow } from "date-fns";
import { useStore } from "@/lib/store";
import { StoryItem } from "@/components/story-item";
import { motion, AnimatePresence } from "framer-motion";

export default function SavedStoriesPage() {
  const { savedStories, searchQuery } = useStore();

  const filteredStories = searchQuery
    ? savedStories.filter((story) =>
        story.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : savedStories;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {filteredStories.length === 0 ? (
          <p className="text-muted-foreground">
            {searchQuery
              ? `No saved stories found matching "${searchQuery}"`
              : "No saved stories yet."}
          </p>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div layout className="space-y-4">
              {filteredStories.map((story) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <StoryItem story={story} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}