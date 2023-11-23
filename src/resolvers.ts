import { HighlightedStory, RefreshResult, Story } from "./types"
import { storyApi } from "./api"

/* 
NOTE: First all the api logic was here but later I had to refactor them into separate functions
because the refresh endpoint called the rest of the endpoints and it's not best practice to call resolvers inside resolvers
*/

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
