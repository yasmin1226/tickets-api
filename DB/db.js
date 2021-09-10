require("dotenv").config();
const mongoose = require("mongoose");

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

module.exports = connectDB;
