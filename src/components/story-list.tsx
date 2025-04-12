"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StoryItem } from "./story-item";
import { StoryType, useStories } from "@/hooks/use-stories";
import { StorySkeleton } from "./story-skeleton";
import { useStore } from "@/lib/store";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface StoryListProps {
  type: StoryType;
}

const ITEMS_PER_PAGE = 20;

export function StoryList({ type }: StoryListProps) {
  const [page, setPage] = useState(1);
  const { data, error, isLoading, isError } = useStories(type);
  const { searchQuery } = useStore();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(10)].map((_, i) => (
          <StorySkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
        Error: {error instanceof Error ? error.message : "Failed to fetch stories"}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="rounded-lg border p-4 text-muted-foreground">
        No stories found.
      </div>
    );
  }

  const filteredStories = searchQuery
    ? data.filter((story) =>
        story.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : data;

  const totalPages = Math.ceil(filteredStories.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedStories = filteredStories.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  if (filteredStories.length === 0) {
    return (
      <div className="rounded-lg border p-4 text-muted-foreground">
        No stories found matching &ldquo;{searchQuery}&rdquo;
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AnimatePresence mode="popLayout">
        <motion.div layout className="space-y-4">
          {paginatedStories.map((story) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <StoryItem story={story} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i + 1}>
                <PaginationLink
                  onClick={() => setPage(i + 1)}
                  isActive={page === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className={page === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}