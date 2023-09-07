require("dotenv").config();

const dbConnect = require("./db_connection/connection");
const app = require("./app");
const port = process.env.PORT || 3000;

dbConnect();

app.listen(port, (req, res) => {
  console.log(`App is running on port ${port}`);
});
