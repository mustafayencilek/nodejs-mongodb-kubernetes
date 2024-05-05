const express = require("express");
const compression = require("compression");
const dotenv = require("dotenv");
const path = require("path");
const helmet = require("helmet");
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require("./config/swagger");
const UserRoutes = require("./api-routes/UserRoute");
const TransactionRoutes = require("./api-routes/TransactionRoute");

dotenv.config();
if (process.env.NODE_ENV !== "test") {
  const { connectDB } = require("./db");
  connectDB();
}
const port = process.env.PORT;
const app = express();

app.use(compression());
app.use(express.json());
app.use(helmet());
app.use(express.static(path.join(__dirname, "views")));

const server = app.listen(port, () => {
  console.log(`
      🔉  Listening on port ${port}
    `);
  app.use("/users", UserRoutes.router);
  app.use("/transactions", TransactionRoutes.router);
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
  app.use((req, res) => {
    res.sendFile(path.join(__dirname, "views", "not-found.html"));
  });
});
module.exports = server;
