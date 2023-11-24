# Changelog

-Added comments
- Refactored logic to get top stories into a separate function
- Optimized getting a random story
  - Instead of getting a random index of to get a random story to check if the URL fetching its URL works -> Now the list is filtered to only contain stories with URLs and then fetch it.
- Added a function to get the Error message based on the error code.
- Added an env var to be able to disable the cache (for testing the highlighted story logic)