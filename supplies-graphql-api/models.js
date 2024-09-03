import mongoose from "./db.js";

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

export default SaleCollection;
