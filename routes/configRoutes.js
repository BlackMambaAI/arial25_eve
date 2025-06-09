const indexR = require("./index");
const userR = require("./users");
const carsR = require("./cars");




exports.routesInit = (app) => {

  // הגדרת ראוטים
  app.use("/", indexR)
  app.use("/users", userR)
  app.use("/cars",carsR);


}