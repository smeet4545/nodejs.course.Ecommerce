import express from "express";
import User from "../models/user.model.js";
import { registerValidation, handleValidationErrors, loginValidation } from "../validators/auth.validator.js";
import { generateToken } from "../helpers/jwt.js";
import { handleRouteError } from "../helpers/error-handling.js";

const router = express.Router();

router.post("/register", registerValidation, handleValidationErrors, async (req, res) => {

    try {
        const user = new User(req.body);

        const {email} = req.body;
        
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: req.t("emailAlreadyExists")
            });
        }
        await user.save();
        const token = generateToken(user);

        res.status(201).json({
            success: true,
            message: req.t("userRegisteredSuccessfully"),
            data: user.toJSON(),
            token: token
        });

    } catch (error) {
        handleRouteError(error, res);
    }
});


router.post("/login",loginValidation, handleValidationErrors, async (req, res) => {

    const {email, password} = req.body;

    try {
        const userData = await User.findOne({ email });

        if(!userData){
            return res.status(401).json({
                success: false,
                message: req.t("userNotFound")
            });
        }

        const isPasswordCorrect = await userData.comparePassword(password);

        if(!isPasswordCorrect){
            return res.status(401).json({
                success: false,
                message: req.t("incorrectPassword")    
            })
        }

        const token = generateToken(userData);

        return res.status(200).json({
            success: true,
            message: req.t("loginSuccessful"),
            data: {
                user: userData.toJSON(),
                token: token
            }

        })

    } catch (error) {
        handleRouteError(error, res);
    }

});

export default router;