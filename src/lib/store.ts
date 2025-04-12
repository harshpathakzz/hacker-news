import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Story } from './types';

interface StoreState {
  savedStories: Story[];
  searchQuery: string;
  addSavedStory: (story: Story) => void;
  removeSavedStory: (id: number) => void;
  isSaved: (id: number) => boolean;
  setSearchQuery: (query: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      savedStories: [],
      searchQuery: '',
      addSavedStory: (story) =>
        set((state) => ({
          savedStories: [...state.savedStories, story],
        })),
      removeSavedStory: (id) =>
        set((state) => ({
          savedStories: state.savedStories.filter((s) => s.id !== id),
        })),
      isSaved: (id) => get().savedStories.some((s) => s.id === id),
      setSearchQuery: (query) => set({ searchQuery: query }),
    }),
    {
      name: 'hacker-news-storage',
      partialize: (state) => ({ savedStories: state.savedStories }),
    }
  )
);