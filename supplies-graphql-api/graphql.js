import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLList,
  GraphQLSchema,
  GraphQLInputObjectType,
} from "graphql";
import Sale from "./models.js";

const ItemType = new GraphQLObjectType({
  name: "Item",
  fields: () => ({
    name: { type: GraphQLString },
    tags: { type: new GraphQLList(GraphQLString) },
    price: { type: GraphQLFloat },
    quantity: { type: GraphQLInt },
  }),
});

const CustomerType = new GraphQLObjectType({
  name: "Customer",
  fields: () => ({
    gender: { type: GraphQLString },
    age: { type: GraphQLInt },
    email: { type: GraphQLString },
    satisfaction: { type: GraphQLInt },
  }),
});

const SaleType = new GraphQLObjectType({
  name: "Sale",
  fields: () => ({
    id: { type: GraphQLString },
    saleDate: { type: GraphQLString },
    items: { type: new GraphQLList(ItemType) },
    storeLocation: { type: GraphQLString },
    customer: { type: CustomerType },
    couponUsed: { type: GraphQLBoolean },
    purchaseMethod: { type: GraphQLString },
    totalPrice: {
      type: GraphQLFloat,
      resolve(parent) {
        // Calculate the total price
        return parent.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },
    },
  }),
});

// ItemInputType behövs för att kunna skapa en ny Sale
const ItemInputType = new GraphQLInputObjectType({
  name: "ItemInput",
  fields: () => ({
    name: { type: GraphQLString },
    tags: { type: new GraphQLList(GraphQLString) },
    price: { type: GraphQLFloat },
    quantity: { type: GraphQLInt },
  }),
});

// CustomerInputType behövs för att kunna skapa en ny Sale
const CustomerInputType = new GraphQLInputObjectType({
  name: "CustomerInput",
  fields: () => ({
    gender: { type: GraphQLString },
    age: { type: GraphQLInt },
    email: { type: GraphQLString },
    satisfaction: { type: GraphQLInt },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    sale: {
      type: SaleType,
      args: { id: { type: GraphQLString } },
      resolve(parent, args) {
        return Sale.findById(args.id);
      },
    },
    sales: {
      type: new GraphQLList(SaleType),
      args: {
        limit: { type: GraphQLInt },
        storeLocation: { type: GraphQLString },
      },
      resolve(parent, args) {
        return Sale.find({})
          .where("storeLocation")
          .equals(args.storeLocation)
          .limit(args.limit);
      },
    },
    totalAmountPerLocation: {
      type: GraphQLFloat,
      args: {
        storeLocation: { type: GraphQLString },
      },
      resolve(parent, args) {
        return Sale.find({})
          .where("storeLocation")
          .equals(args.storeLocation)
          .then((sales) => {
            return sales.reduce((sum, sale) => {
              return (
                sum +
                sale.items.reduce(
                  (sum, item) => sum + item.price * item.quantity,
                  0
                )
              );
            }, 0);
          });
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addSale: {
      type: SaleType,
      args: {
        saleDate: { type: GraphQLString },
        items: { type: new GraphQLList(ItemInputType) }, // Use the Input Type here
        storeLocation: { type: GraphQLString },
        customer: { type: CustomerInputType }, // Use the Input Type here
        couponUsed: { type: GraphQLBoolean },
        purchaseMethod: { type: GraphQLString },
      },
      resolve(parent, args) {
        let sale = new Sale({
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

const graphqlSchema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

export default graphqlSchema;
