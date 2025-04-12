import axios from 'axios';

const BASE_URL = 'https://hacker-news.firebaseio.com/v0';

const api = {
  async getStoryIds(type: 'top' | 'new' | 'best'): Promise<number[]> {
    try {
      const response = await axios.get(`${BASE_URL}/${type}stories.json`);
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error(`Invalid response for ${type} stories`);
      }
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${type} story IDs:`, error);
      throw error;
    }
  },

  async getStory(id: number) {
    try {
      const response = await axios.get(`${BASE_URL}/item/${id}.json`);
      if (!response.data || !response.data.id) {
        throw new Error(`Invalid story data for ID: ${id}`);
      }
      return response.data;
    } catch (error) {
      console.error(`Error fetching story ${id}:`, error);
      return null; // Return null for failed stories to filter them out later
    }
  },
};

export { api };