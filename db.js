import mongoose from "mongoose";

mongoose.connect(
  "mongodb+srv://fredriklindroth:kaBVIArVStnD92nk@cluster0.x4lmd.mongodb.net/sample_supplies"
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

export default mongoose;
