import express from "express";
import { graphqlHTTP } from "express-graphql";
import graphqlSchema from "./graphql.js";

// En express-server skapas och GraphQL integreras med express som middleware med graphqlHTTP
const app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    graphiql: true,
  })
);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
