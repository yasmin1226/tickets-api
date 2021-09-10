const AppError = require("../utiles/appError");
const APIFeatures = require("../utiles/APIFeatures");
const catchAsync = require("../utiles/catchAsync");
const Ticket = require("./../models/ticketModel");
const User = require("../models/userModel");

const Reply = require("./../models/replyModel");

exports.getAllReplies = catchAsync(async (req, res) => {
  let filter = {};
  if (req.params.ticketId) filter = { ticket: req.params.ticketId };
  const replies = await Reply.find(filter);
  res.status(200).json(replies);
});
exports.createReply = catchAsync(async (req, res, next) => {
  console.log("req.user", res.user);
  //allow nested routes

  if (!req.body.ticket) req.body.ticket = req.params.ticketId;
  if (!req.body.user) req.body.user = res.user._id;
  console.log("Req.body.user", res.user.role);
  const ticket = await Ticket.findById(req.body.ticket);
  console.log("here");

  console.log("ticket", ticket);
  console.log("ticket.user", ticket.user);
  console.log("user", res.user._id);
  console.log("role", res.user.role === "customer");
  console.log("==", String(res.user._id) === String(ticket.user));
  if (
    res.user.role === "customer" &&
    String(res.user._id) !== String(ticket.user)
  ) {
    console.log("not user ticket");

    next(new AppError("that is not your tiket ", 401));
  } else {
    console.log("user ticket");
    const reply = await Reply.create(req.body);
    res.status(200).json(reply);
  }
});
exports.updateReply = catchAsync(async (req, res, next) => {
  const reply = await Reply.findById(req.params.id);
  console.log("Reply", reply);
  // if (!req.body.user) req.body.user = res.user._id;
  if (!reply) {
    throw Error("that reply not exist");
  } else {
    console.log("reply.user", reply.user);
    console.log("res.user.id", res.user._id);
    if (String(reply.user._id) !== String(res.user._id)) {
      next(new AppError("that is not your reply", 404));
    } else {
      const updatedReply = await Reply.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
      res.status(200).json(updatedReply);
    }
  }
});

exports.deleteReply = catchAsync(async (req, res) => {
  const reply = await Reply.findByIdAndDelete(req.params.id);
  if (!reply) {
    throw Error("that reply not exist");
  }
  res.status(200).json({ msg: "reply deleted" });
});
