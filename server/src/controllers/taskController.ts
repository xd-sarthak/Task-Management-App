import { Request, Response } from "express";
import { prisma } from "../utils/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

//get tasks from project
export const getTasks = asyncHandler(
  async (req: Request, res: Response) => {
    const projectId = Number(req.query.projectId);

    if (!projectId || isNaN(projectId)) {
      throw new ApiError(400, "Valid projectId is required");
    }

    const tasks = await prisma.task.findMany({
      where: { projectId },
      include: {
        author: true,
        assignee: true,
        comments: true,
        attachments: true,
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, tasks, "Tasks fetched successfully"));
  }
);

//createa a task
export const createTask = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      title,
      description,
      status,
      priority,
      tags,
      startDate,
      dueDate,
      points,
      projectId,
      authorUserId,
      assignedUserId,
    } = req.body;

    if (!title) {
      throw new ApiError(400, "Task title is required");
    }

    if (!projectId) {
      throw new ApiError(400, "projectId is required");
    }

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        tags,
        startDate: startDate ? new Date(startDate) : undefined,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        points,
        projectId,
        authorUserId,
        assignedUserId,
      },
    });

    return res
      .status(201)
      .json(new ApiResponse(201, newTask, "Task created successfully"));
  }
);

//update task status
export const updateTaskStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const taskId = Number(req.params.taskId);
    const { status } = req.body;

    if (!taskId || isNaN(taskId)) {
      throw new ApiError(400, "Valid taskId is required");
    }

    if (!status) {
      throw new ApiError(400, "Status is required");
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { status },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, updatedTask, "Task status updated"));
  }
);

//get task for user
export const getUserTasks = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = Number(req.params.userId);

    if (!userId || isNaN(userId)) {
      throw new ApiError(400, "Valid userId is required");
    }

    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { authorUserId: userId },
          { assignedUserId: userId },
        ],
      },
      include: {
        author: true,
        assignee: true,
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, tasks, "User's tasks retrieved successfully"));
  }
);
