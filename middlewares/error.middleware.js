import { ApiError } from "../utils/ApiError.js";

export const errorHandler = (err, req, res, next) => {
    let error = err;

    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        const message = `${field} already exists`;
        error = new ApiError(409, message);
    }

    if (err.name === "ValidationError") {
        const errors = Object.values(err.errors).map((e) => e.message);
        error = new ApiError(400, "Validation Error", errors);
    }

    if (err.name === "CastError") {
        const message = `Invalid ${err.path}: ${err.value}`;
        error = new ApiError(400, message);
    }

    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errors: error.errors || [],
        ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
    });
};
