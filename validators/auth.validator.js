import {body, validationResult} from "express-validator";

export  const registerValidation = [
    body("email").isEmail().withMessage((value, {req}) => req.t("enterValidEmail")),
    body("password").isLength({min: 6}),
    body("role").optional().isIn(["admin", "user"]),
    body("userName").notEmpty().withMessage((value, {req}) => req.t("usernameRequired")),
    body("city").notEmpty().withMessage((value, {req}) => req.t("cityRequired")),
    body("postalCode").notEmpty().withMessage((value, {req}) => req.t("postalCodeRequired")),
    body("addressLine1").notEmpty().withMessage((value, {req}) => req.t("addressLine1Required")),
    body("addressLine2").optional(),
    body("phoneNumber")
    .notEmpty().withMessage("Phone number is required")
    .matches(/^\+?[0-9]{10,15}$/).withMessage("Invalid phone number format")

 ]

 export const loginValidation = [
    body("email").
    isEmail().
    withMessage((value, {req}) => req.t("enterValidEmail")),

    body("password").isLength({min: 6})
    .withMessage((value, {req}) => req.t("passwordMustBeAtLeast6Characters"))
 ]

 export const handleValidationErrors = (req, res, next) => {
   const errors =  validationResult(req);
   if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
   }
   next();
 }