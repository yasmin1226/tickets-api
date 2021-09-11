const mongoose = require("mongoose");
process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);

  console.log("uncaughtException ");
  process.exit(1); //1 nessasry
});
const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://yasmin:7gD2jIo5zy0VceiM@cluster0.rdafp.mongodb.net/tickets?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        //useCreateIndex: true,
        //  useFindAndModify: false,
      }
    );
    console.log("MongoDB Connected Successfully...");
  } catch (err) {
    console.error(err.message);
    //Exit process with failure
    process.exit(1);
  }
};
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("unhandler rejection");
  server.close(() => {
    process.exit(1); //1optional
  });
});

module.exports = connectDB;
