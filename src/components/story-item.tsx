"use client";

import { formatDistanceToNow } from "date-fns";
import { Share2, Bookmark, BookmarkCheck } from "lucide-react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Story } from "@/lib/types";

interface StoryItemProps {
  story: Story;
}

export function StoryItem({ story }: StoryItemProps) {
  const { addSavedStory, removeSavedStory, isSaved } = useStore();
  const saved = isSaved(story.id);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: story.title,
          url: story.url,
        });
        toast.success("Story shared successfully!");
      } catch (err) {
        if (err.name !== "AbortError") {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(story.url);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const toggleSave = () => {
    if (saved) {
      removeSavedStory(story.id);
      toast.success("Story removed from saved items");
    } else {
      addSavedStory(story);
      toast.success("Story saved successfully");
    }
  };

  return (
    <div className="group rounded-lg border p-4 shadow-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <a
            href={story.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-medium hover:text-orange-500"
          >
            {story.title}
          </a>
          <div className="text-sm text-muted-foreground">
            {story.score} points by {story.by}{" "}
            {formatDistanceToNow(story.time * 1000, { addSuffix: true })}
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleSave}>
            {saved ? (
              <BookmarkCheck className="h-4 w-4 text-orange-500" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}