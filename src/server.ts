import express from "express"
import { ApolloServer, gql } from "apollo-server-express"
import resolvers from "./resolvers"
import { INTERVAL_MS, storyApi } from "./api"
import "dotenv/config"

const typeDefs = gql`
  ${require("fs").readFileSync(require.resolve("../schema.graphql"), "utf8")}
`
const PORT = process.env.PORT || 4000

async function startServer() {
  try {
    const server = new ApolloServer({ typeDefs, resolvers })
    await server.start()

    /* 
    ALTERNATIVE: Apollo's standalone server
    https://www.apollographql.com/docs/apollo-server/api/standalone/
    */
    const app = express()
    server.applyMiddleware({ app })

    app.listen(PORT, () => {
      console.log(
        `Server listening on http://localhost:${PORT}${server.graphqlPath}`
      )
      // Where the magic happens
      storyApi.start(INTERVAL_MS)
    })
  } catch (error) {
    console.error("Error starting the server:", error)
  }
}

startServer()
