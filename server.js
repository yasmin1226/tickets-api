const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss");
const connectDB = require("./DB/db");
const userRouter = require("./routes/userRoutes");
const ticketRouter = require("./routes/ticketRoutes");
const replyRouter = require("./routes/replyRoutes");
const { default: AdminBro } = require("admin-bro");
const options = require("./routes/admin.options");
const globalHandeler = require("./controllers/errorController");
const buildAdminRouter = require("./routes/admin.router");
// const adminRouter = require("./routes/admin.router");
app.use(cors());
//connect database

app.get("/", function (req, res) {
  res.send("Hello World");
});
if (process.env.NODE_ENV === "environment") {
  console.log("if");
  app.use(morgan("dev"));
  console.log("if");
}
console.log("out");

app.use(cookieParser());
app.use(express.json());
app.use(mongoSanitize()); // "email":{"$gt":""},
// app.use(xss());
app.use("/api/users", userRouter);
app.use("/api/ticket", ticketRouter);
app.use("/api/reply", replyRouter);
//app.use("/admin", adminRouter);
// app.use(adminBro.options.rootPath, adminRouter);
const adminBro = new AdminBro({
  databases: [mongoose],
  rootPath: "/admin",
  branding: {
    // logo: "https://i.imgur.com/iOHA54J.png",
    companyName: "Tickets",
    softwareBrothers: false, // if Software Brothers logos should be shown in the sidebar footer
  },
});

///jandle every url that doen,t handle it
//must be the last one
app.all("*", (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server`, 404)); //will skip all middlewares
});
const run = async () => {
  connectDB();

  const admin = new AdminBro(options);
  const router = buildAdminRouter(adminBro);
  app.use(admin.options.rootPath, router);
  app.listen(4000, () => {
    console.log("app runnimg .......");
  });
};
//error handling middleware
app.use(globalHandeler);
module.exports = run;
