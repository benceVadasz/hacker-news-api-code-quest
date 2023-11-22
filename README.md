# Fullstack Engineer Quest - Backend

## Installation

Install the required packages using:

```bash
npm install
```
Start the server by running:

```bash
npm run dev
```
> Nodemon is listening to local changes


### Upon server start, 3 sections should be logged to the console
- 10 most recent stories and the
- 10 most popular stories
- A highlighted story


### GraphQL Queries and Mutations
You can access the GraphQL Playground at http://localhost:4000/graphql. Here you can interact with the provided resolvers and mutations.

#### Recent Stories

<details><summary>Query</summary>

```
query {
  recent {
    id
    by
    descendants
    kids
    score
    time
    title
    type
    url
  }
}
```

</details>



#### Popular Stories

<details><summary>Query</summary>

```
query {
  popular {
    id
    by
    descendants
    kids
    score
    time
    title
    type
    url
  }
}
```

</details>

#### Highlighted Story
Each highlighted story should stay up for an hour.

<details><summary>Query</summary>

```
query {
  highlight {
    id
    by
    descendants
    kids
    score
    time
    title
    type
    url
    metaDescription
  }
}

```

</details>

#### Refresh
Calling the refresh endpoint should immediately refetch the API endpoints meaning that the console should log the new data.
<details><summary>Mutation</summary>

```
mutation {
  refresh {
    message
    success
  }
}

```

</details>

### Shortcuts
- I did use an article to kickstart the Apollo server and make sure it's set up correctly
- I had to google quite a bit to make URL fetching work (needed for the refresh functionality)