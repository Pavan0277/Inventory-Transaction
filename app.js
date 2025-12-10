import express from "express";
import productRoutes from "./routes/product.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: process.env.CORS_ORIGIN,
}));

app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is running",
    });
});

app.use("/products", productRoutes);

app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

app.use(errorHandler);

export { app };
