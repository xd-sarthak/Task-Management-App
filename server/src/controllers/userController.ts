import { Request, Response } from "express";
import { prisma } from "../utils/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

//get all users
export const getUsers = asyncHandler(
  async (req: Request, res: Response) => {
    const users = await prisma.user.findMany();

    return res
      .status(200)
      .json(new ApiResponse(200, users, "Users retrieved successfully"));
  }
);

//get a single user
export const getUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { cognitoId } = req.params;

    const user = await prisma.user.findUnique({
      where: { cognitoId },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, user, "User retrieved successfully"));
  }
);

 //create a new user
export const postUser = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      username,
      cognitoId,
      profilePictureUrl = "i1.jpg",
      teamId = 1,
    } = req.body;

    const newUser = await prisma.user.create({
      data: {
        username,
        cognitoId,
        profilePictureUrl,
        teamId,
      },
    });

    return res
      .status(201)
      .json(
        new ApiResponse(201, newUser, "User created successfully")
      );
  }
);
