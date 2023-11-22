import { baseStoryUrl } from "./api/axios"
import { HighlightedStory } from "./types"
import validUrl from "valid-url"

const CURRENT_TIMESTAMP = (
  Math.floor(Date.now() / (60 * 60 * 1000)) *
  (60 * 60 * 1000)
).toString()

const getUrlStatus = async (url: string) => {
  if (!url) {
    return { isOk: false, status: 404 }
  }
  try {
    const response = await fetch(url)

    return { isOk: response.ok, status: response.status }
  } catch (error) {
    return { isOk: false, status: error.status ?? "unknown error" }
  }
}

export const getRandomStory = async () => {
  try {
    const { data: topStoryIds } = await baseStoryUrl.get(
      "/topstories.json?print=pretty"
    )
    const randomIndex = Math.floor(Math.random() * topStoryIds.length)

    const { data: storyResponse } = await baseStoryUrl.get(
      `/item/${randomIndex}.json?print=pretty`
    )
    const { isOk, status } = await getUrlStatus(storyResponse?.url)
    if (
      !storyResponse?.url ||
      !isOk ||
      !validUrl.isWebUri(storyResponse?.url)
    ) {
      console.log(
        `Fetching url of story with id ${randomIndex} failed with ${status}. Fetching a new one...`
      )

      return getRandomStory()
    } else {
      return storyResponse
    }
  } catch (error) {
    return getRandomStory()
  }
}

let cache = {}

export const storyCache = {
  get: () => {
    const cachedStory = cache[CURRENT_TIMESTAMP]
    if (cachedStory) {
      return cachedStory
    } else {
      return null
    }
  },
  add: (story: HighlightedStory) => {
    cache[CURRENT_TIMESTAMP] = story
  },
}
