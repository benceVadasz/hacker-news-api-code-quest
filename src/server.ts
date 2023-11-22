import express from "express"
import { ApolloServer, gql } from "apollo-server-express"
import resolvers from "./resolvers"
import { INTERVAL_MS, storyApi } from "./api"

const typeDefs = gql`
  ${require("fs").readFileSync(require.resolve("../schema.graphql"), "utf8")}
`
const PORT = process.env.PORT || 4000

async function startServer() {
  try {
    const server = new ApolloServer({ typeDefs, resolvers })
    await server.start()

    const app = express()
    server.applyMiddleware({ app })

    // Where the magic happens
    storyApi.start(INTERVAL_MS)

    app.listen(PORT, () => {
      console.log(
        `Server listening on http://localhost:${PORT}${server.graphqlPath}`
      )
    })
  } catch (error) {
    console.error("Error starting the server:", error)
  }
}

startServer()
