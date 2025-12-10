import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
            index: true,
        },
        type: {
            type: String,
            enum: ["INCREASE", "DECREASE"],
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, "Quantity must be greater than 0"],
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

transactionSchema.index({ productId: 1, timestamp: -1 });

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
