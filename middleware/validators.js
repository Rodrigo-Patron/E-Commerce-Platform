import { body, validationResult } from "express-validator";

export const newUserValidator = [
  body("email").isEmail().withMessage("Please enter a valid Email"),
  body("password")
    .isLength({ min: 8, max: 16 })
    .withMessage("Password must be in range of 8-16 characters")
    .not()
    .isLowercase()
    .withMessage("Password must contain a uppercase character")
    .not()
    .isUppercase()
    .withMessage("Password must contain an lowercase character")
    .not()
    .isNumeric()
    .withMessage("Password must contain a number"),
  (req, res, next) => {
    const errors = validationResult(req);
    // console.log(errors.errors);
    if (!errors.isEmpty()) {
      next({
        status: 422,
        message: errors.errors.map((err) => {
          return { message: err.msg, param: err.param };
        }),
      });
    } else {
      next();
    }
  },
];

export const newProductValidator = [
  body("price")
    .custom((val) => {
      if (val > 0) return true;
      return false;
    })
    .withMessage("Price must be positive"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next({
        status: 422,
        message: errors.errors.map((err) => {
          return { message: err.msg };
        }),
      });
    } else {
      next();
    }
  },
];
