# GraphQL with MongoDB and Node.js

### Step 1: Set Up the Project

1. **Create a new directory for your project**:

   ```bash
   mkdir graphql-mongodb-nodejs
   cd graphql-mongodb-nodejs
   ```

2. **Initialize a new Node.js project**:

   ```bash
   npm init -y
   ```

3. **Install reqddduired dependencies**:

   ```bash
   npm install express express-graphql graphql mongoose
   ```

   - `express`: A web framework for Node.js.
   - `express-graphql`: A middleware to connect GraphQL with Express.
   - `graphql`: A reference implementation of GraphQL for JavaScript.
   - `mongoose`: An ODM (Object Data Modeling) library for MongoDB and Node.js.

4. **Install nodemon**:

   ```bash
   npm install nodemon --save-dev
   ```

5. **Add the following line in `package.json` to use `import` instead of `reddquire`:**

    ```bash
    "type": "module",
    ```

6. **Add server start script in `package.json`:**

    ```bash
    "start": "nodemon server.js"
    ```

### Step 2: Set Up MongoDB with Mongoose

1. **Create a file `db.js` to connect to MongoDB**:

   ```javascript
   import mongoose from 'mongoose';

   mongoose.connect('"mongodb+srv://yourusername:yourpassword@yourmongocloudurl/sample_supplies"');

   const db = mongoose.connection;

   db.on('error', console.error.bind(console, 'connection error:'));
   db.once('open', function() {
       console.log('Connected to MongoDB');
   });

  export default mongoose;

   ```

   Replace `'mongodb+srv://yourusername:yourpassword@yourmongocloudurl/sample_supplies'` with your actual MongoDB URI.

2. **Define the Sale Mongoose Schema**:
   Create a file named `models.js` to define your data schema:

   ```javascript
   import mongoose from './db.js';

   const SaleMongooseSchema = new mongoose.Schema({
     saleDate: String,  // Using String to store dates
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

   const Sale = mongoose.model('Sale', SaleMongooseSchema);

  export default Sale;
   ```

### Step 3: Set Up the GraphQL Schema

1. **Define the GraphQL schema and resolvers in `schema.js`**:

   ```javascript
   import {
     GraphQLObjectType,
     GraphQLString,
     GraphQLInt,
     GraphQLFloat,
     GraphQLBoolean,
     GraphQLList,
     GraphQLSchema,
     GraphQLInputObjectType,
    } from 'graphql';
   import Sale from './models.js';

   // Define ItemType for the items array (Output Type)
   const ItemType = new GraphQLObjectType({
     name: 'Item',
     fields: () => ({
       name: { type: GraphQLString },
       tags: { type: new GraphQLList(GraphQLString) },
       price: { type: GraphQLFloat },
       quantity: { type: GraphQLInt },
     }),
   });

   // Define CustomerType for the customer object (Output Type)
   const CustomerType = new GraphQLObjectType({
     name: 'Customer',
     fields: () => ({
       gender: { type: GraphQLString },
       age: { type: GraphQLInt },
       email: { type: GraphQLString },
       satisfaction: { type: GraphQLInt },
     }),
   });

   // Define ItemInputType for the items array (Input Type)
   const ItemInputType = new GraphQLInputObjectType({
     name: 'ItemInput',
     fields: () => ({
       name: { type: GraphQLString },
       tags: { type: new GraphQLList(GraphQLString) },
       price: { type: GraphQLFloat },
       quantity: { type: GraphQLInt },
     }),
   });

   // Define CustomerInputType for the customer object (Input Type)
   const CustomerInputType = new GraphQLInputObjectType({
     name: 'CustomerInput',
     fields: () => ({
       gender: { type: GraphQLString },
       age: { type: GraphQLInt },
       email: { type: GraphQLString },
       satisfaction: { type: GraphQLInt },
     }),
   });

   // Define SaleType (Output Type) with additional summary fields
   const SaleType = new GraphQLObjectType({
     name: 'Sale',
     fields: () => ({
       id: { type: GraphQLString },
       saleDate: { type: GraphQLString },  // Using String for date
       items: { type: new GraphQLList(ItemType) },
       storeLocation: { type: GraphQLString },
       customer: { type: CustomerType },
       couponUsed: { type: GraphQLBoolean },
       purchaseMethod: { type: GraphQLString },
       totalPrice: {
         type: GraphQLFloat,
         resolve(parent) {
           // Calculate the total price
           return parent.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
         },
       },
       totalQuantity: {
         type: GraphQLInt,
         resolve(parent) {
           // Calculate the total quantity
           return parent.items.reduce((sum, item) => sum + item.quantity, 0);
         },
       },
     }),
   });

   // Define Root Query
   const RootQuery = new GraphQLObjectType({
     name: 'RootQueryType',
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
         resolve(parent, args) {
           return Sale.find({});
         },
       },
     },
   });

   // Define Mutation for Adding a Sale
   const Mutation = new GraphQLObjectType({
     name: 'Mutation',
     fields: {
       addSale: {
         type: SaleType,
         args: {
           saleDate: { type: GraphQLString }, // Use String for date
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
   ```

### Step 4: Set Up the Express Server

1. **Create `server.js` to set up the Express server**:

   ```javascript
   import express from "express";
   import { graphqlHTTP } from "express-graphql";
   import graphqlSchema from './schema.js';

   const app = express();

   app.use('/graphql', graphqlHTTP({
       graphqlSchema,
       graphiql: true, // Enable GraphiQL UI
   }));

   const PORT = process.env.PORT || 4000;

   app.listen(PORT, () => {
       console.log(`Server is running on http://localhost:${PORT}/graphql`);
   });
   ```

### Step 5: Run the Server

1. **Start the server**:

   ```bash
   npm run start
   ```

2. **Access GraphiQL**:
   Open your browser and navigate to `http://localhost:4000/graphql`. Here, you can run GraphQL queries and mutations.

### Step 6: Test GraphQL Queries 

**Get All Sales**:
   Run the following query to retrieve all sales with the summarized item data:

   ```graphql
   {
     sales {
       id
       saleDate
       storeLocation
       couponUsed
       purchaseMethod
       customer {
         gender
         age
         email
         satisfaction
       }
       items {
      name
      tags
      price
      quantity
    }
     }
   }
