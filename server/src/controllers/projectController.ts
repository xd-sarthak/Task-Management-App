import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

const prisma = new PrismaClient();

//get all projects
export const getProjects = asyncHandler(
  async (req: Request, res: Response) => {

    req.log.info("Fetching all projects");
    const projects = await prisma.project.findMany();

     req.log.info({ count: projects.length }, "Projects fetched");

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
      req.log.warn("Project creation failed — missing name");
      throw new ApiError(400, "Project name is required");
    }

    req.log.info({ body: req.body }, "Creating new project");

    const newProject = await prisma.project.create({
      data: {
        name,
        description,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      },
    });

    req.log.info(
      { projectId: newProject.id },
      "Project created successfully"
    );

    return res
      .status(201)
      .json(
        new ApiResponse(201, newProject, "Project created successfully")
      );
  }
);
