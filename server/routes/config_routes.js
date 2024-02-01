const indexR = require("./index");
const restaurantR = require("./restaurants");
const tableR = require("./tables");
const orderR = require("./orders");
const userR = require("./users");

exports.routesInit = (app) => {
  app.use("/", indexR);
  app.use("/table", tableR);
  app.use("/restaurant", restaurantR);
  app.use("/order", orderR)
  app.use("/user", userR)
}