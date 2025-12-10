import express from "express";
import {
    createProduct,
    increaseStock,
    decreaseStock,
    getProductSummary,
    getTransactionHistory,
} from "../controllers/product.controller.js";

const router = express.Router();

router.post("/", createProduct);

router.post("/:id/increase", increaseStock);

router.post("/:id/decrease", decreaseStock);

router.get("/:id", getProductSummary);

router.get("/:id/transactions", getTransactionHistory);

export default router;
