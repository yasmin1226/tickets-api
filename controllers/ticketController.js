const AppError = require("../utiles/appError");
const APIFeatures = require("../utiles/APIFeatures");
const catchAsync = require("../utiles/catchAsync");
const Ticket = require("./../models/ticketModel");
const User = require("../models/userModel");

exports.aliasTopTickets = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "createdAt";

  req.query.fields = "title,createdAt";
  next();
};

//route handelar
//get one ticket
exports.getOneTicket = catchAsync(async (req, res, next) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    return next(new AppError("no Ticket found with that id", 404));
  }
  res.status(200).json({
    status: "success",
    data: { ticket },
  });
});

//get my tekets
exports.myTickets = async (req, res, next) => {
  console.log("mytickets");
  req.query.user = res.user._id;
  console.log(res.user._id);
  next();
};
//geconstt all tickets
exports.getAllTickets = catchAsync(async (req, res, next) => {
  //execute the query
  //const { authorizaion } = req.headers;
  //const signData = jwt.verify(authorizaion, "Bearer");
  //console.log(signData);
  console.log("req.query", req.query);
  req.query.sort = "-updatedAt";
  const features = new APIFeatures(Ticket.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tickets = await features.query;
  res.status(200).json({
    status: "sucscess",
    results: tickets.length,
    data: { tickets: tickets },
  });
});

//add ticket
exports.createTicket = catchAsync(async (req, res, next) => {
  console.log("add");
  console.log("user", res.user);
  const user = res.user;
  //const getUser=await User
  const me = await User.findById(res.user._id).populate("tickets");
  console.log("me", me);
  const newTicket = await Ticket.create({ ...req.body, user: res.user._id });
  me.tickets.push(newTicket);

  await me.save();
  res.status(201).json({
    status: "success",
    data: {
      ticket: newTicket,
    },
  });
});

//update ticket
exports.updateTicket = catchAsync(async (req, res, next) => {
  let ticket = Ticket.findById(req.params.id);
  // const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {
  //   new: true,
  //   runValidators: true,
  // });
  if (!ticket) {
    return next(new AppError("no ticket found with that id", 404));
  } else {
    console.log(res.user.role);

    if (res.user.role === "customer" && req.body.status) {
      next(new AppError("you not allowed to change status"), 401);
    } else {
      req.body.updatedAt = Date.now();
      ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      console.log(ticket);
      res.status(200).json({
        status: "success",
        data: {
          ticket,
        },
      });
    }
  }
});

//delete ticket
exports.deleteTicket = catchAsync(async (req, res, next) => {
  const ticket = await Ticket.findByIdAndRemove(req.params.id);

  if (!ticket) {
    return next(new AppError("no ticket found with that id", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});
