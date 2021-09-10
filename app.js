const express = require("express");
const morgan = require("morgan");
const comperaion = require("compression");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
var hpp = require("hpp");

//image
// const util = require("util");
// const path = require("path");

// app.configure(function () {
//   app.set("port", process.env.PORT || 3000);
//   app.set("views", __dirname + "/views");
//   app.use(express.favicon());
//   app.use(express.logger("dev"));
//   app.use(
//     express.bodyParser({
//       keepExtensions: true,
//       uploadDir: __dirname + "/public/uploads",
//     })
//   );
//   app.use(express.methodOverride());
//   app.use(app.router);
//   app.use(express.static(path.join(__dirname, "/public")));
//   app.use(express.static(__dirname + "/static"));
//   app.use(express.errorHandler());
// });
// //

const AppError = require("./utiles/appError");
const globalHandeler = require("./controllers/errorController");
const productRouter = require("./routes/productRoutes");
const userRouter = require("./routes/userRoutes");
const orderRouter = require("./routes/orderRoutes");
const app = express();

//hanan
const cors = require("cors");
var corsOptions = {
  origin: "http://localhost:4200",
};

app.use(cors(corsOptions));
app.use(helmet());

//middleware
if (process.env.NODE_ENV === "environment") {
  app.use(morgan("dev"));
}
app.use(cookieParser());
app.use(express.json());
app.use(mongoSanitize());
app.use(xss());

//
// app.use(
//   hpp({
//     whitelist: [""],
//   })
// );
app.use(express.static(`${__dirname}/public`));
app.use(comperaion());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(c); //error
  //console.log(req.headers);
  next();
});

//routes

app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);

app.get("/", (req, res) => {
  res.send("heruko!");
});
///jandle every url that doen,t handle it
//must be the last one
app.all("*", (req, res, next) => {
  // const err = new Error(`can't find ${req.originalUrl} on this server`);
  // err.status = "fail";
  // err.statusCode = 404;

  next(new AppError(`can't find ${req.originalUrl} on this server`, 404)); //will skip all middlewares
});

//hanan
app.use((options) => options.AllowAnyOrigin());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT ,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
//error handling middleware
app.use(globalHandeler);
module.exports = app;
