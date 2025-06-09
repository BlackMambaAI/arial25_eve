// ייבוא של אקפרס
const express = require("express");
// ספרייה שיודעת לעשות מינפולציה על כתובות יו אר אל
const path = require("path");
// ספרייה שיודעת להריץ שרת
const http = require("http");
const cors = require("cors");

// import {routesInit} from "./routes/configRoutes"
const {routesInit} = require("./routes/configRoutes")
// התחברות ל DB
require("./db/mongoConnect");

// מגדיר משתנה שמקבל את יכולות האקספרס ומאפשר להוסיף לו יכולות
const app = express();
app.use(cors());

// מגדיר שנוכל לקבל באדי בבקשת פוסט ועריכה
app.use(express.json());


// הגדרת תקייה ציבורית
app.use(express.static(path.join(__dirname,"public")));

// פונקציה שמגדירה את כל הראוטים שלנו
routesInit(app)

// req - מה השרת מקבל , כגון משתנים בכתובת
// res - מה השרת מגניב
// app.use("/",(req,res) => {
//   res.json({msg:"Hello from express 333"})
// })

const server = http.createServer(app)

server.listen(3001);

