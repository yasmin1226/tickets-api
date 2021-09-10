const { promisify } = require("util"); //convert a method that returns responses using a callback function to return responses in a promise object.

const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const catchAsync = require("./../utiles/catchAsync");
const AppError = require("./../utiles/appError");

const signToken = (id) => {
  return jwt.sign({ id: id }, "my-secret-jwt", {
    expiresIn: "100d",
  });
};
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  res.cookie("jwt", token, cookieOptions);
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(
    //  {
    req.body
  );
  createSendToken(newUser, 201, res);
});
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //check if email & pass exist
  if (!email || !password) {
    return next(new AppError("please provide email and password", 400));
  }

  //2 if user exist && password is correct
  const user = await User.findOne({ email: email }).select("+password");
  console.log("user", user);
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401)); //unauthorized
  }
  ///3 send token if ok
  createSendToken(user, 201, res);
});

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: "success",
  });
};
exports.protect = catchAsync(async (req, res, next) => {
  console.log("protect");
  console.log("req.headers.authorization", req.headers.authorization);
  //1 get token & chek if its exist
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  //console.log(token);
  if (!token) {
    return next(
      new AppError("you are not logged in ..please log in to get access", 401)
    );
  }

  //2 verification token
  const decoded = await promisify(jwt.verify)(token, "my-secret-jwt");
  // console.log(decoded);
  // //3check if user stil exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(new AppError("the user belongs to this token does no exist"));
  }
  // //4 chek if user change password ofter the token
  res.user = freshUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    console.log("req", res.user);
    if (!roles.includes(res.user.role)) {
      return next(
        new AppError("you dont have permission to perform this actiion ", 403)
      );
    }
    next();
  };
};
