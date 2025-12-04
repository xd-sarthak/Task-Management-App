import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

const prisma = new PrismaClient();

export const getTeams = asyncHandler(
  async (req: Request, res: Response) => {
    req.log.info("Fetching teams");

    const teams = await prisma.team.findMany();

    req.log.info({ teamCount: teams.length }, "Teams base records fetched");

    const teamsWithUsernames = await Promise.all(
      teams.map(async (team: any) => {
        req.log.debug(
          { teamId: team.teamId },
          "Fetching usernames for team members"
        );

        const productOwner = await prisma.user.findUnique({
          where: { userId: team.productOwnerUserId! },
          select: { username: true },
        });

        const projectManager = await prisma.user.findUnique({
          where: { userId: team.projectManagerUserId! },
          select: { username: true },
        });

        req.log.debug(
          {
            teamId: team.teamId,
            productOwner: productOwner?.username,
            projectManager: projectManager?.username,
          },
          "Resolved team user references"
        );

        return {
          ...team,
          productOwnerUsername: productOwner?.username,
          projectManagerUsername: projectManager?.username,
        };
      })
    );

    req.log.info(
      { teamCount: teamsWithUsernames.length },
      "Teams retrieved with usernames"
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          teamsWithUsernames,
          "Teams retrieved successfully"
        )
      );
  }
);
