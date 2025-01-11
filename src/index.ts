import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express, { Express } from "express";
import cors from "cors";

async function createApp() {
  const app: Express = express();
  const port = Number(process.env.PORT) || 8000;

  app.use(cors());
  app.use(express.json());

  const typeDefs = `
    type Query {
      hello: String
    }
  `;

  const resolvers = {
    Query: {
      hello: () => "world",
    },
  };

  const server = new ApolloServer({ typeDefs, resolvers });

  await server.start();

  // @ts-ignore
  app.use("/graphql", expressMiddleware(server));

  app.get("/", (_, res) => {
    res.json({ message: "Hello World" });
  });

  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
}

createApp();
