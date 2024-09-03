import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLSchema,
  GraphQLID,
} from "graphql";
import mongoose from "mongoose";
import express from "express";
import { graphqlHTTP } from "express-graphql";

mongoose.connect(
  "mongodb+srv://fredriklindroth:4XHU0JIURD2huwS5@cluster0.x4lmd.mongodb.net/sample_supplies"
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// beskriver hur dokumentet i databasen ser ut
const SaleMongooseSchema = new mongoose.Schema({
  saleDate: Date,
  items: [
    {
      name: String,
      tags: [String],
      price: Number,
      quantity: Number,
    },
  ],
  storeLocation: String,
  customer: {
    gender: String,
    age: Number,
    email: String,
    satisfaction: Number,
  },
  couponUsed: Boolean,
  purchaseMethod: String,
});

// skapar en modell av schemat. Detta objekt använder vi för att interagera med databasen
const SaleCollection = mongoose.model("Sale", SaleMongooseSchema);

// GraphQL behöver också veta hur dokumenten ser ut där varje objekt är av GraphQLObjectType
const CustomerType = new GraphQLObjectType({
  name: "Customer",
  fields: () => ({
    gender: { type: GraphQLString },
    age: { type: GraphQLInt },
    email: { type: GraphQLString },
    satisfaction: { type: GraphQLInt },
  }),
});

const ItemType = new GraphQLObjectType({
  name: "Item",
  fields: () => ({
    name: { type: GraphQLString },
    tags: { type: GraphQLList(GraphQLString) },
    price: { type: GraphQLFloat },
    quantity: { type: GraphQLInt },
  }),
});

const SaleType = new GraphQLObjectType({
  name: "Sale",
  fields: () => ({
    id: { type: GraphQLID },
    saleDate: { type: GraphQLString },
    items: { type: GraphQLList(ItemType) },
    storeLocation: { type: GraphQLString },
    customer: { type: CustomerType },
    couponUsed: { type: GraphQLBoolean },
    purchaseMethod: { type: GraphQLString },
  }),
});

// Query-objektet beskriver vilka queries som kan göras. Det är motsvarigheten till GET-requests i REST
const Query = new GraphQLObjectType({
  name: "Query",
  fields: {
    sale: {
      type: SaleType,
      args: {
        id: { type: GraphQLString },
      },
      resolve: (parent, args) => {
        return SaleCollection.findById(args.id);
      },
    },
    sales: {
      type: GraphQLList(SaleType),
      resolve: () => {
        return SaleCollection.find();
      },
    },
  },
});

// Mutation-objektet beskriver vilka mutations som kan göras. Det är motsvarigheten till POST, PUT och DELETE i REST
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addSale: {
      type: SaleType,
      args: {
        saleDate: { type: GraphQLString },
        items: { type: GraphQLList(ItemType) },
        storeLocation: { type: GraphQLString },
        customer: { type: CustomerType },
        couponUsed: { type: GraphQLBoolean },
        purchaseMethod: { type: GraphQLString },
      },
      resolve: (parent, args) => {
        const sale = new SaleCollection({
          saleDate: args.saleDate,
          items: args.items,
          storeLocation: args.storeLocation,
          customer: args.customer,
          couponUsed: args.couponUsed,
          purchaseMethod: args.purchaseMethod,
        });
        return sale.save();
      },
    },
  },
});

// Ett GraphQL-schema-objekt skapas med Query- och Mutation-objekten
const graphqlSchema = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});

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
