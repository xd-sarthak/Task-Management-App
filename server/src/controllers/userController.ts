import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

const prisma = new PrismaClient();

//get all users
export const getUsers = asyncHandler(
  async (req: Request, res: Response) => {
    req.log.info("Fetching all users");

    const users = await prisma.user.findMany();

    req.log.info({ count: users.length }, "Users retrieved");

    return res
      .status(200)
      .json(new ApiResponse(200, users, "Users retrieved successfully"));
  }
);

//get a single user
export const getUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { cognitoId } = req.params;

    req.log.info({ cognitoId }, "Fetching user by cognitoId");

    const user = await prisma.user.findUnique({
      where: { cognitoId },
    });

    req.log.info(
      { found: Boolean(user), cognitoId },
      "User fetch completed"
    );

    return res
      .status(200)
      .json(new ApiResponse(200, user, "User retrieved successfully"));
  }
);

 //create a new user
export const postUser = asyncHandler(
  async (req: Request, res: Response) => {
    req.log.info({ body: req.body }, "Creating new user");

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

    req.log.info(
      { userId: newUser.userId, cognitoId },
      "User created successfully"
    );

    return res
      .status(201)
      .json(
        new ApiResponse(201, newUser, "User created successfully")
      );
  }
);
