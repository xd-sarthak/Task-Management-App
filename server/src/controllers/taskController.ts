import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

const prisma = new PrismaClient();

//get tasks from project
export const getTasks = asyncHandler(
  async (req: Request, res: Response) => {
    const projectId = Number(req.query.projectId);

    req.log.info({ projectId }, "Fetching tasks for project");

    if (!projectId || isNaN(projectId)) {
      req.log.warn("Invalid projectId received");
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

    req.log.info({ count: tasks.length }, "Tasks fetched");

    return res
      .status(200)
      .json(new ApiResponse(200, tasks, "Tasks fetched successfully"));
  }
);

//createa a task
export const createTask = asyncHandler(
  async (req: Request, res: Response) => {
    req.log.info({ body: req.body }, "Creating new task");

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
      req.log.warn("Task creation failed — missing title");
      throw new ApiError(400, "Task title is required");
    }

    if (!projectId) {
      req.log.warn("Task creation failed — missing projectId");
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

    req.log.info({ taskId: newTask.id }, "Task created successfully");

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

    req.log.info({ taskId, status }, "Updating task status");

    if (!taskId || isNaN(taskId)) {
      req.log.warn("Invalid taskId received for status update");
      throw new ApiError(400, "Valid taskId is required");
    }

    if (!status) {
      req.log.warn("Task status update failed — missing status");
      throw new ApiError(400, "Status is required");
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { status },
    });

    req.log.info({ taskId: updatedTask.id }, "Task status updated");

    return res
      .status(200)
      .json(new ApiResponse(200, updatedTask, "Task status updated"));
  }
);

//get task for user
export const getUserTasks = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = Number(req.params.userId);

    req.log.info({ userId }, "Fetching tasks for user");

    if (!userId || isNaN(userId)) {
      req.log.warn("Invalid userId received");
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

    req.log.info({ count: tasks.length }, "User tasks retrieved");

    return res
      .status(200)
      .json(new ApiResponse(200, tasks, "User's tasks retrieved successfully"));
  }
);
