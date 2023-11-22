import { HighlightedStory, RefreshResult, Story } from "./types"
import { storyApi } from "./api"

const resolvers = {
  Query: {
    recent: async (): Promise<Story[]> => await storyApi.getMostRecentStories(),
    popular: async (): Promise<Story[]> =>
      await storyApi.getMostPopularStories(),
    highlight: async (): Promise<HighlightedStory> =>
      await storyApi.getHighlightedStory(false),
  },
  Mutation: {
    refresh: async (): Promise<RefreshResult> => {
      try {
        storyApi.renderStories(true)
        return { message: "Refreshed!", success: true }
      } catch (error) {
        console.error("Refresh failed:", error)
        return { message: "Refresh failed", success: false }
      }
    },
  },
}

export default resolvers
