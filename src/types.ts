export type Story = {
  id: number
  by: string
  descendants: number
  kids: number[]
  score: number
  time: number
  title: string
  type: string
  url: string
}

export type HighlightedStory = Story & { metaDescription: string }

export interface StoryCache {
  [cacheKey: string]: HighlightedStory
}

export type RefreshResult = {
  success: boolean
  message: string
}
