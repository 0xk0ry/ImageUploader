import { Request, Response } from "express";
import * as userService from "../services/userService.js";
import { z } from "zod";
import { AuthRequest } from "../middleware/authMiddleware.js";
import { updateProfileSchema } from "../utils/validators.js";

export const getProfile = async (req: Request, res: Response) => {
  try {
    const username = Array.isArray(req.params.username) ? req.params.username[0] : req.params.username;

    // Call the service logic
    const userProfile = await userService.getUserProfile(username);

    res.status(200).json(userProfile);
  } catch (error: any) {
    if (error.message === "User not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateMyProfile = async (req: AuthRequest, res: Response) => {
  try {
    // 1. Validate the input body
    const validatedData = updateProfileSchema.parse(req.body);

    // 2. Extract userId from the decoded JWT (via middleware)
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // 3. Call the service
    const updatedUser = await userService.updateProfile(userId, validatedData);

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.flatten().fieldErrors });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};