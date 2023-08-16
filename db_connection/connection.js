const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const dbConnect = () => {
  // Connect to the database
  //   const dbConnectionString =
  //     process.env.DATABASE_URL.replace(
  //       "<PASSWORD>",
  //       process.env.DATABASE_PASSWORD
  //     );
  const dbConnectionString =
    process.env.DATABASE_URL;

  // REMOTE DATABASE
  mongoose
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
