import SaleCollection from "./models.js";
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLID,
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean,
} from "graphql";

console.log("Graphql.js beginning...", new Date().toISOString());

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
    id: { type: GraphQLString },
    saleDate: { type: GraphQLString },
    items: { type: GraphQLList(ItemType) },
    storeLocation: { type: GraphQLString },
    customer: {
      type: new GraphQLObjectType({
        name: "Customer",
        fields: () => ({
          gender: { type: GraphQLString },
          age: { type: GraphQLInt },
          email: { type: GraphQLString },
          satisfaction: { type: GraphQLInt },
        }),
      }),
    },
    couponUsed: { type: GraphQLBoolean },
    purchaseMethod: { type: GraphQLString },
    totalPrice: {
      type: GraphQLFloat,
      resolve(parent) {
        return parent.items.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );
      },
    },
  }),
});

const SaleType2 = new GraphQLObjectType({
  name: "Sale",
  fields: () => ({
    id: { type: GraphQLString },
    saleDate: { type: GraphQLString },
    items: { type: new GraphQLList(ItemType) },
    storeLocation: { type: GraphQLString },
    customer: {
      type: new GraphQLObjectType({
        name: "Customer",
        fields: () => ({
          gender: { type: GraphQLString },
          age: { type: GraphQLInt },
          email: { type: GraphQLString },
          satisfaction: { type: GraphQLInt },
        }),
      }),
    },
    couponUsed: { type: GraphQLBoolean },
    purchaseMethod: { type: GraphQLString },
    totalPrice: {
      type: GraphQLFloat,
      resolve(parent) {
        return parent.items.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    sales: {
      type: new GraphQLList(SaleType),
      args: {
        limit: { type: GraphQLInt },
        storeLocation: { type: GraphQLString },
      },
      // resolve är en funktion som kommunicerar med databasen
      resolve(parent, args) {
        return SaleCollection.find()
          .where("storeLocation")
          .equals(args.storeLocation)
          .limit(args.limit);
      },
    },
    sale: {
      type: SaleType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return SaleCollection.findById(args.id);
      },
    },
    totalAmountPerLocation2: {
      type: GraphQLFloat,
      args: {
        storeLocation: { type: GraphQLString },
      },
      resolve(parent, args) {
        // const documents = await SaleCollection.find({})
        //   .where("storeLocation")
        //   .equals(args.storeLocation)

        return SaleCollection.find({})
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

const graphqlSchema = new GraphQLSchema({
  query: RootQuery,
});

export default graphqlSchema;
