import { Request, Response } from "express";
import * as userService from "../services/userService.js";
import { z } from "zod";

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
