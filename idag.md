---
marp: true
---

# Codealong och repetition med GraphQL

## Idag

- Import istället för require (se länk för sammanfattning)
  - Något modernare sätt att importera
- Repetition GraphQL (med databasen sample_supplies.sales)
- Refaktorering
- Filtera med .where och begränsa med .limit
- Summera (aggregera) värden

---

## Länkar

- [Bra sammanfattning av GraphQL vs REST](https://www.youtube.com/watch?v=yWzKJPw_VzM&t=72s)
- [Import vs require](https://www.scaler.com/topics/nodejs/require-vs-import-nodejs/)
- [Mongoose queries](https://mongoosejs.com/docs/queries.html)

---

## Pseudokod

1. Projekt setup - Installera express express-graphql graphql mongoose nodenmon
2. Skapa uppkoppling mot databas (sample_supplies.sales)
3. Skapa mongoose schema (beskriver dokumentet i databasen)
4. Definera GraphQL-schema (omvandlar queries i /grapghql till databasfrågor)
5. Skapa query för att hämta alla sales och specifik sale
6. Refaktorera om till separata filer.
7. Begränsa antal dokument i sales med .limit
8. Filtrera på storeLocation med .where i sales
9. Lägg till fältet totalAmount på SaleType med resolve-funktionen som räknar ut den totala summan för alla items på ett Sale-dokument (price * quantity för alla items)
10. Lägg till query-funktionen totalAmountPerLocation som räknar ut totala summan för alla sales på en specifik storeLocation
