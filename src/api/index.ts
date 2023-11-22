import { getRandomStory, storyCache } from "../utils"
import { baseStoryUrl } from "./axios"
import cheerio from "cheerio"
import fetch from "node-fetch"

const LIMIT = 10
// 5 minutes ⬇️
export const INTERVAL_MS = 5 * 60 * 1000

const getMostRecentStories = async () => {
  try {
    const { data: topStoryIds } = await baseStoryUrl.get(
      "/topstories.json?print=pretty"
    )
    const topStoriesPromises = topStoryIds.map(async (id: number) => {
      const { data: storyResponse } = await baseStoryUrl.get(
        `/item/${id}.json?print=pretty`
      )
      return storyResponse
    })
    const topStories = await Promise.all(topStoriesPromises)
    return topStories.sort((a, b) => b.time - a.time).slice(0, LIMIT)
  } catch (error) {
    throw new Error(`Error fetching most recent top stories: ${error.message}`)
  }
}

const getMostPopularStories = async () => {
  try {
    const { data: topStoryIds } = await baseStoryUrl.get(
      "/topstories.json?print=pretty"
    )

    const topStoriesPromises = topStoryIds.map(async (id: number) => {
      const { data: storyResponse } = await baseStoryUrl.get(
        `/item/${id}.json?print=pretty`
      )
      return storyResponse
    })
    const topStories = await Promise.all(topStoriesPromises)
    const sortedTopStories = topStories.sort((a, b) => b.score - a.score)
    return sortedTopStories.slice(0, LIMIT)
  } catch (error) {
    throw new Error(`Error fetching most popular top stories: ${error.message}`)
  }
}

const getHighlightedStory = async (isRefresh?: boolean) => {
  try {
    const story =
      !isRefresh && storyCache.get() ? storyCache.get() : await getRandomStory()

    if (!storyCache.get()) {
      storyCache.add(story)
    }

    const response = await fetch(story.url)
    const html = await response.text()
    const parse = cheerio.load(html)
    const metaDescription = parse('meta[property="og:description"]').attr(
      "content"
    )

    const storyWithMetaDescription = {
      ...story,
      metaDescription: !response.ok
        ? `Failed to fech: ${response.status ?? "404"}`
        : metaDescription ?? "Meta description not found",
    }

    return storyWithMetaDescription
  } catch (error) {
    throw new Error(`Error fetching random story: ${error.message}`)
  }
}

const renderStories = async (isRefresh?: boolean) => {
  console.log("The 10 most recent stories are:")
  console.table(await getMostRecentStories())
  console.log("The 10 most popular stories are:")
  console.table(await getMostPopularStories())
  console.log("Highlighted story is:")
  console.table(await getHighlightedStory(isRefresh))
}

const start = async (interval = INTERVAL_MS) => {
  renderStories()
  setInterval(() => {
    renderStories()
  }, interval)
}

export const storyApi = {
  getMostRecentStories,
  getHighlightedStory,
  getMostPopularStories,
  renderStories,
  start,
}
