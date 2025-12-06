import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const errorHandler = (
err: any,
req: Request,
res: Response,
next: NextFunction
) => {
if (err instanceof ApiError) {
console.error("Handled ApiError:", { err, requestId: (req as any).id });
return res
.status(err.statusCode)
.json(new ApiResponse(err.statusCode, null, err.message));
}

console.error("Unhandled Error:", { err, requestId: (req as any).id });

return res
.status(500)
.json(new ApiResponse(500, null, "Internal Server Error"));
};