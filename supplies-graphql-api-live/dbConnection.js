import mongoose from "mongoose";

console.log("Beginning of dbConnection.js", new Date().toISOString());


mongoose.connect(
  "mongodb+srv://fredriklindroth:kaBVIArVStnD92nk@cluster0.x4lmd.mongodb.net/sample_supplies"
);

const db = mongoose.connection;

db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to database", new Date().toISOString()));

const myConnection = mongoose;

export default myConnection;
