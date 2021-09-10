const { default: AdminBro } = require("admin-bro");
const { buildAuthenticatedRouter } = require("admin-bro-expressjs");
const AdminBroMongoose = require("admin-bro-mongoose");
const User = require("../models/userModel");
AdminBro.registerAdapter(AdminBroMongoose);

const buildAdminRouter = (admin) => {
  const router = buildAuthenticatedRouter(
    admin,
    {
      cookieName: "admin-bro",
      cookiePassword: "adminadminadmin",
      authenticate: async (email, password) => {
        const admin = await User.findOne({ email }).select("+password");
        if (
          admin &&
          admin.role === "admin" &&
          (await admin.correctPassword(password, admin.password))
        ) {
          return admin.toJSON();
        } else {
          return null;
        }
      },
    },
    null,
    {
      resave: false,
      saveUninitialized: true,
    }
  );
  return router;
};

module.exports = buildAdminRouter;
