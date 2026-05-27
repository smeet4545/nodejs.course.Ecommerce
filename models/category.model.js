import mongoose from "mongoose";
const categorySchema = mongoose.Schema({
    name: String
});

categorySchema.virtual("id").get(function() {
    return this._id.toHexString()
});

categorySchema.set("toJSON", {
    virtuals: true
});

export const Category = mongoose.model("Category", categorySchema);
// exports.Category = mongoose.model("Category", categorySchema);
// when you impot in other you need to define import {Category} because it is a name exports like "export const Category" this