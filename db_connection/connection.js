const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const dbConnect = async () => {
  // Connect to the database
  const dbConnectionString =
    process.env.DATABASE_URL;

  // REMOTE DATABASE
  await mongoose
    .connect(dbConnectionString, {
      useNewUrlParser: true,
    })
    .then(() => {
      console.log(
        "Successfully connected to database"
      );
    });
};

module.exports = dbConnect;
