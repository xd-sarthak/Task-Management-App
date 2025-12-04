import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import pinoHttp from "pino-http";


export const errorHandler = (
err: any,
req: Request,
res: Response,
next: NextFunction
) => {
const logger = (req as any).log || console;


if (err instanceof ApiError) {
logger.error({ err, requestId: (req as any).id }, "Handled ApiError");
return res
.status(err.statusCode)
.json(new ApiResponse(err.statusCode, null, err.message));
}


logger.error({ err, requestId: (req as any).id }, "Unhandled Error");


return res
.status(500)
.json(new ApiResponse(500, null, "Internal Server Error"));
};