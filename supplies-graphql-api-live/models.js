import myConnection from "./dbConnection.js";

console.log("Beginning of models.js", new Date().toISOString());

const saleSchema = new myConnection.Schema({
  // _id: mongoose.Schema.Types.ObjectId,
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

const SaleCollection = myConnection.model("Sale", saleSchema);

export default SaleCollection;
