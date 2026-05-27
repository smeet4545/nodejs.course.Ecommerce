
import express from "express";
import {Category} from "../models/category.model.js";
const router = express.Router();

router.post("/", async(req, res) => {
    try{

        if(!req.body.name || req.body.name.trim().length < 3){
            return res.status(400).send({
                message: req.t("categoryNameValidation")
            });
        };

        const newCategory = await Category.create({
            name: req.body.name
        });
        return res.status(200).send(newCategory);

    } catch (error) {
        return res.status(400).send({message: error.message});
    }
});

router.get("/", async(req, res) => {
    try {
        const CategoriesList = await Category.find();
        if(!CategoriesList || CategoriesList.length === 0){
            return res.send({message: "noCategories"}); 

        }
        res.send(CategoriesList);
    } catch (error) {
        res.status(400).send({message: error.message});
    }
});

router.delete("/:id", async(req, res) => {
    try {
        const catg = Category.findByIdAndDelete(req.params.id);

        if(!catg){
            res.status(404).send({message: "categoryNotFound"});
        }
        return res.send({message: req.t("categoryDeletedSuccessfully")});
    } catch (error) {
        res.status(400).send({message: error.message})
    }
});

router.put("/:id", async(req, res) => {
    try {
        const catg = await Category.findByIdAndUpdate(req.params.id, {
            name: req.body.name
        });

        if(!catg){
            res.status(404).send({message: "categoryNotFound"});
        };
        return res.send({message: req.t("categoryUpdatedSuccessfully")});
    } catch (error) {
        res.status(400).send({message: error.message})
    }
});

export default router
// module.exports = router
