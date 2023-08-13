/* create server with swagger and morgan dev */
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const morgan = require("morgan");
const mogoose = require("mongoose");
require("dotenv").config();

// const bodyParser = require("body-parser");

const auth_routes = require("./routes/auth_routes.js");
const error_routes = require("./routes/error_routes.js");

const docs = require("./docs");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

// app.use(
//   "/api-docs",
//   swaggerUi.serve,
//   swaggerUi.setup(docs)
// );

app.use("/api", auth_routes);
// app.use(error_routes);

mogoose
  .connect(process.env.MONGO_DEV_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(
        `Server is running on port ${port}`
      );
    });
  })
  .catch((err) => {
    console.log(err);
  });
