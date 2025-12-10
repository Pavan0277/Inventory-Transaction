import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
        },
        sku: {
            type: String,
            required: [true, "SKU is required"],
            unique: true,
            uppercase: true,
            trim: true,
        },
        currentStock: {
            type: Number,
            required: true,
            default: 0,
            min: [0, "Stock cannot be negative"],
        },
        totalIncreased: {
            type: Number,
            default: 0,
            min: 0,
        },
        totalDecreased: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

productSchema.index({ sku: 1 });

const Product = mongoose.model("Product", productSchema);

export default Product;
