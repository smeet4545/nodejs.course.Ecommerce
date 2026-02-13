require("dotenv").config();
const mpngoose = require("mongoose");
const express = require("express");
const mongoose = require("mongoose");

const i18next = require("i18next");
const backend = require("i18next-fs-backend");
const middleware = require("i18next-http-middleware");

i18next
    .use(backend)
    .use(middleware.LanguageDetector)
    .init({
        fallbackLng: "en",
        backend:{
            loadPath:"locales/{{lng}}.json"
        }
    });

const app = express();
const port = process.env.PORT
const api = process.env.API


mongoose.connect(process.env.CONNECTION_STRING)
.then(() => console.log("Connected to mongodb successfully...."))
.catch((error) => console.log(error));

app.use(middleware.handle(i18next))

app.get(`${api}/health`, (req, res) => {
    res.send(req.t("validationFailed"))
})

app.listen(port, () => {
    console.log(`Server started successfully,..at http://localhost:${port}`);
});

