const multer = require("multer");
const sharp = require("sharp"); //fpr resize image
const User = require("./../models/userModel");
const catchAsync = require("./../utiles/catchAsync");
const APIFeatures = require("./../utiles/APIFeatures");
const AppError = require("./../utiles/appError");
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/img/users");
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split("/")[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("not image", 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single("photo");

exports.resizeUserPhoto = (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);
  next();
};
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

//exports.uploadUserPhoto = upload.single("photo");

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
exports.updateMe = catchAsync(async (req, res, next) => {
  // console.log("req.file", req.file);
  //console.log("req.bofy", req.body);

  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError("this route is not for update pass", 400));
  }

  const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true,
  });
  // console.log("updatedUser", updatedUser);
  // user.name = "yas";
  //await user.save();
  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});
exports.getOneUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError("no user found with that id", 404));
  }
  res.status(200).json({
    status: "success",
    data: { user },
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  console.log("get all");
  // const users = await User.find();
  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const users = await features.query;
  //send response

  res.status(200).json({
    status: "sucscess",
    results: users.length,
    data: { users: users },
  });
});
exports.createUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  //console.log(req.body);
  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    return next(new AppError("no user found with that id", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndRemove(req.params.id);
  res.status(204).json({
    status: "success",
    data: null,
  });
  if (!user) {
    return next(new AppError("no user found with that id", 404));
  }
});
