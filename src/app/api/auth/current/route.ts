import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import User from "@/app/models/user.model";
import { validateToken } from "@/app/middlewares/validateToken";

export async function GET(request: NextRequest) {
  await connectDB();

  try {
    const tokenData = await validateToken(request);

    if (tokenData instanceof NextResponse) {
      return tokenData; // This means token validation failed
    }

    // Remember that the middleware returns the LoggedInUserId
    const loggedInUserId = tokenData;

    // Finding all users in the DB in exception of the one who's logged in / authenticated
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    return NextResponse.json(filteredUsers, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(
    { error: "An Unknown error occurred" },
    { status: 500 }
  );
}
