const mongoose = require("mongoose");
const replySchema = new mongoose.Schema({
  reply: {
    type: String,
    required: [true, "reply cant be empty"],
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },

  ticket: {
    type: mongoose.Schema.ObjectId,
    ref: "Ticket",
    required: [true, "reply must belongs to a ticket "],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "reply must belongs to  a user"],
  },
});
replySchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name",
  });
  next();
});

const Reply = mongoose.model("Reply", replySchema);
module.exports = Reply;
