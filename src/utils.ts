import { baseStoryUrl } from "./api/axios"
import { HighlightedStory } from "./types"
import validUrl from "valid-url"

/* 
Could have placed it in the API folder
*/

const CURRENT_TIMESTAMP = (
  Math.floor(Date.now() / (60 * 60 * 1000)) *
  (60 * 60 * 1000)
).toString()

export const getTopStories = async () => {
  try {
    const { data: topStoryIds } = await baseStoryUrl.get(
      "/topstories.json?print=pretty"
    )
    /*
    Disadvantage of Promise.all is that if one fails, the array does not return.
    ALTERNATIVE: allSettled
    */
    const topStoriesPromises = topStoryIds.map(async (id: number) => {
      const { data: storyResponse } = await baseStoryUrl.get(
        `/item/${id}.json?print=pretty`
      )
      return storyResponse
    })
    const topStories = await Promise.all(topStoriesPromises)
    return topStories
  } catch (error) {
    throw new Error(`Error fetching most recent top stories: ${error.message}`)
  }
}

const getUrlStatus = async (url: string) => {
  try {
    const response = await fetch(url)

    return { isOk: response.ok, status: response.status }
  } catch (error) {
    console.log(error)

    return { isOk: false, status: error.status ?? "unknown error" }
  }
}

type ErrorType = "failedToFetchUrl" | "other"

const getErrorMessage = ({
  type,
  url,
  index,
  status,
}: {
  type: ErrorType
  url?: string
  index?: number
  status?: number
}) => {
  switch (type) {
    case "failedToFetchUrl":
      return `Failed to fetch URL ${url} for story with id ${index}. Fetching a new one...`
    case "other":
      return `Fetching URL ${url} for story with id ${index} failed with ${status}. Fetching a new one...`
  }
}

export const getRandomStory = async () => {
  try {
    const topStories = await getTopStories()
    const topStoriesWithUrls = topStories.filter((story) => story.url)

    const randomIndex = Math.floor(Math.random() * topStoriesWithUrls.length)
    const randomStory = topStoriesWithUrls[randomIndex]
    const url = randomStory.url

    const { isOk, status } = await getUrlStatus(url)

    if (!isOk || !validUrl.isWebUri(url)) {
      console.log(
        getErrorMessage({
          type: status ? "other" : "failedToFetchUrl",
          index: randomIndex,
          status,
          url,
        })
      )
      return getRandomStory()
    } else {
      return randomStory
    }
  } catch (error) {
    return getRandomStory()
  }
}

const cache = {}
/* 
Could be impoved so:
get: () => cache[CURRENT_TIMESTAMP]
will be undefined if there are no stories in the cache
*/
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
