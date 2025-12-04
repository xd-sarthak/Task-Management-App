import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

const prisma = new PrismaClient();

export const search = asyncHandler(
  async (req: Request, res: Response) => {
    const query = req.query.query as string;

    req.log.info({ query }, "Search request received");

    if (!query || query.trim().length === 0) {
      req.log.warn("Empty search query");
      throw new ApiError(400, "Search query is required");
    }

    req.log.info("Executing search across tasks, projects, and users");

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

    req.log.info(
      {
        taskCount: tasks.length,
        projectCount: projects.length,
        userCount: users.length,
      },
      "Search completed"
    );

    return res
      .status(200)
      .json(
        new ApiResponse(200, { tasks, projects, users }, "Search results fetched")
      );
  }
);
