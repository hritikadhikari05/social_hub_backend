require("dotenv").config();

const dbConnect = require("./db_connection/connection");
const app = require("./app");
const port = 3000;

dbConnect();

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
