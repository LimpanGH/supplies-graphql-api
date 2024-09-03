import graphqlSchema from "./graphql.js";
import express from "express";
import { graphqlHTTP } from "express-graphql";

const expressApp = express();

console.log("Server is starting...", new Date().toISOString());

expressApp.use(
  "/graphql",
  // graphqlHTTP är en middleware som integrerar express med graphql
  graphqlHTTP({
    schema: graphqlSchema,
    graphiql: true,
  })
);

expressApp.listen(4000, () => {
  console.log("Server is running on port 4000", new Date().toISOString());
});

// 1. Projekt setup
// Installera express express-graphql graphql mongoose nodenmon
// 2. Skapa uppkoppling mot databas (sample_supplies.sales)
// 3. Skapa mongoose schema (beskriver dokumentet i databasen)
// 4. Definera GraphQL-schema (omvandlar queries i /grapghql till databasfrågor)
// 5. Skapa query för att hämta alla sales och specifik sale
// 6. Refaktorera om till separata filer.
// 7. Begränsa antal dokument i sales med .limit
// 8. Filtrera på storeLocation med .where i sales
// 9. Lägg till fältet totalAmount på SaleType med resolve-funktionen som räknar ut den totala summan för alla items på ett Sale-dokument (price * quantity för alla items)
// 10. Lägg till query-funktionen totalAmountPerLocation som räknar ut totala summan för alla sales på en specifik storeLocation

