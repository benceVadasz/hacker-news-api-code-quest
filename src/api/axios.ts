import axios from "axios"

export const baseStoryUrl = axios.create({
  baseURL: "https://hacker-news.firebaseio.com/v0",
})
