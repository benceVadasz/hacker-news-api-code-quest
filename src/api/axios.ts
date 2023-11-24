import axios from "axios"

/* 
On second thought it could be named as hackerNewsApi
*/
export const baseStoryUrl = axios.create({
  baseURL: "https://hacker-news.firebaseio.com/v0",
})
