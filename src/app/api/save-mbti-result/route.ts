// src/app/api/save-mbti-result.ts

import { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "@/lib/mongodb"; // Assuming your MongoDB connection is setup in 'mongodb.ts'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { userId, result } = req.body;

  if (!userId || !result) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection("mbti-results");

    // Insert the test result associated with the userId
    await collection.insertOne({ userId, result, timestamp: new Date() });

    return res.status(200).json({ message: "Test result saved successfully" });
  } catch (error) {
    console.error("Error saving test result:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
