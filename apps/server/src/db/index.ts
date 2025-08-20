import mongoose from "mongoose";

mongoose.set("strictQuery", false);

await mongoose.connect(process.env.DATABASE_URL || "").catch((error) => {
  console.log("Error connecting to database:", error);
});

console.log("Connected to DB:", mongoose.connection.db?.databaseName);

const client = mongoose.connection.getClient().db("krishi-mitra");

export { client };
