import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express, { Express } from "express";
import cors from "cors";
import { prismaClient } from "./lib/db";

async function createApp() {
  const app: Express = express();
  const port = Number(process.env.PORT) || 8000;

  app.use(cors());
  app.use(express.json());

  const typeDefs = `
    type Query {
      hello: String
      say(name: String): String
    }
    type Mutation {
    createUser(email: String!, password: String!, firstName: String!, lastName: String!, profileImageUrl: String): Boolean}
  `;

  const resolvers = {
    Query: {
      hello: () => "world",
    },
    Mutation: {
      createUser: async (
        _: any,
        {
          email,
          password,
          firstName,
          lastName,
          profileImageUrl,
        }: {
          email: string;
          password: string;
          firstName: string;
          lastName: string;
          profileImageUrl: string;
        }
      ) => {
        await prismaClient.user.create({
          data: {
            email,
            password,
            firstName,
            lastName,
            profileImageUrl,
            salt: "salt",
          },
        });
        return true;
      },
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
