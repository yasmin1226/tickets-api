const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss");
const connectDB = require("./DB/db");
const userRouter = require("./routes/userRoutes");
const ticketRouter = require("./routes/ticketRoutes");
const replyRouter = require("./routes/replyRoutes");
const { default: AdminBro } = require("admin-bro");
const options = require("./routes/admin.options");
const buildAdminRouter = require("./routes/admin.router");
// const adminRouter = require("./routes/admin.router");

//connect database

app.get("/", function (req, res) {
  res.send("Hello World");
});

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
const run = async () => {
  connectDB();

  const admin = new AdminBro(options);
  const router = buildAdminRouter(adminBro);
  app.use(admin.options.rootPath, router);
  app.listen(3000, () => {
    console.log("app runnimg .......");
  });
};

module.exports = run;
