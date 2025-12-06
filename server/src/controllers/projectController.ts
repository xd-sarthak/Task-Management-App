import { Request, Response } from "express";
import { prisma } from "../utils/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

//get all projects
export const getProjects = asyncHandler(
  async (req: Request, res: Response) => {
    const projects = await prisma.project.findMany();

    return res
      .status(200)
      .json(new ApiResponse(200, projects, "Projects retrieved successfully"));
  }
);

//create project
export const createProject = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, description, startDate, endDate } = req.body;

    if (!name) {
      throw new ApiError(400, "Project name is required");
    }

    const newProject = await prisma.project.create({
      data: {
        name,
        description,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      },
    });

    return res
      .status(201)
      .json(
        new ApiResponse(201, newProject, "Project created successfully")
      );
  }
);
