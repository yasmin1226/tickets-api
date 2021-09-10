const mongoose = require("mongoose");
const slugify = require("slugify");
const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "a ticket must hava a name"],
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "ticket must belongs to a User"],
  },
  status: {
    type: String,
    enum: ["pending", "active", "closed"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

const Ticket = mongoose.model("Ticket", ticketSchema);
module.exports = Ticket;
