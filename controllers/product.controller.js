import Product from "../models/product.model.js";
import Transaction from "../models/transaction.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createProduct = asyncHandler(async (req, res) => {
    const { name, sku, initialStock } = req.body;

    if (!name || !sku) {
        throw new ApiError(400, "Name and SKU are required");
    }

    if (initialStock !== undefined && initialStock < 0) {
        throw new ApiError(
            400,
            "Initial stock must be greater than or equal to 0"
        );
    }

    const existingProduct = await Product.findOne({ sku: sku.toUpperCase() });
    if (existingProduct) {
        throw new ApiError(409, "Product with this SKU already exists");
    }

    const product = await Product.create({
        name,
        sku: sku.toUpperCase(),
        currentStock: initialStock || 0,
        totalIncreased: initialStock || 0,
        totalDecreased: 0,
    });

    if (initialStock && initialStock > 0) {
        await Transaction.create({
            productId: product._id,
            type: "INCREASE",
            quantity: initialStock,
            timestamp: new Date(),
        });
    }

    return res
        .status(201)
        .json(new ApiResponse(201, product, "Product created successfully"));
});

export const increaseStock = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
        throw new ApiError(400, "Quantity must be greater than 0");
    }

    const product = await Product.findById(id);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    product.currentStock += quantity;
    product.totalIncreased += quantity;
    await product.save();

    await Transaction.create({
        productId: product._id,
        type: "INCREASE",
        quantity,
        timestamp: new Date(),
    });

    return res
        .status(200)
        .json(new ApiResponse(200, product, "Stock increased successfully"));
});

export const decreaseStock = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
        throw new ApiError(400, "Quantity must be greater than 0");
    }

    const product = await Product.findById(id);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    if (product.currentStock - quantity < 0) {
        throw new ApiError(
            400,
            `Insufficient stock. Current stock: ${product.currentStock}, requested: ${quantity}`
        );
    }

    product.currentStock -= quantity;
    product.totalDecreased += quantity;
    await product.save();

    await Transaction.create({
        productId: product._id,
        type: "DECREASE",
        quantity,
        timestamp: new Date(),
    });

    return res
        .status(200)
        .json(new ApiResponse(200, product, "Stock decreased successfully"));
});

export const getProductSummary = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    const summary = {
        _id: product._id,
        name: product.name,
        sku: product.sku,
        currentStock: product.currentStock,
        totalIncreased: product.totalIncreased,
        totalDecreased: product.totalDecreased,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
    };

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                summary,
                "Product summary fetched successfully"
            )
        );
});

export const getTransactionHistory = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    const transactions = await Transaction.find({ productId: id })
        .sort({ timestamp: -1 })
        .select("type quantity timestamp -_id");

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                transactions,
                "Transaction history fetched successfully"
            )
        );
});
