import dotenv from "dotenv";
import express from "express";
import mongoose  from "mongoose";
import i18next from "i18next";
import backend from "i18next-fs-backend";
import middleware from "i18next-http-middleware";
import cors from "cors";
import morgan from "morgan"
import categoryRouter from "./routes/category.routes.js"
import authRoute from "./routes/auth.routes.js"
import { authMiddleware } from "./middleware/auth.middleware.js";

dotenv.config();
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

app.use(middleware.handle(i18next));
app.use(express.json());
app.use(morgan("tiny"));
app.use(cors({
    origin: ["http://localhost:3000", "https://mydomain.com"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Accept-Language"]
}));

app.use(authMiddleware);
app.use(`${api}/auth`, authRoute);
app.use(`${api}/categories`, categoryRouter);


app.get(`${api}/health`, (req, res) => {
    res.send(req.t("validationFailed"))
});

app.listen(port, () => {
    console.log(`Server started successfully,..at http://localhost:${port}`);
});

