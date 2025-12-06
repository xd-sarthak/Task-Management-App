import { Request, Response } from "express";
import { prisma } from "../utils/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const search = asyncHandler(
  async (req: Request, res: Response) => {
    const query = req.query.query as string;

    if (!query || query.trim().length === 0) {
      throw new ApiError(400, "Search query is required");
    }

    const [tasks, projects, users] = await Promise.all([
      prisma.task.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        },
      }),

      prisma.project.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        },
      }),

      prisma.user.findMany({
        where: {
          username: { contains: query, mode: "insensitive" },
        },
      }),
    ]);

    return res
      .status(200)
      .json(
        new ApiResponse(200, { tasks, projects, users }, "Search results fetched")
      );
  }
);
