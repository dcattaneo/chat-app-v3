"use server";

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import { loginSchema } from "@/app/schema/authSchema";
import { validateSchema } from "@/app/middlewares/validateSchema";
import User from "@/app/models/user.model";
import bcrypt from "bcrypt";
import { createAccessToken } from "@/app/lib/jwt";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  await connectDB();

  try {
    const data = await request.json();
    const validationResult = validateSchema(loginSchema);
    const result = await validationResult(data);

    if (result.status !== 200) {
      return result;
    }

    const { email, password } = data;

    const userFound = await User.findOne({ email });

    if (!userFound) {
      return NextResponse.json({ message: "User not found" }, { status: 400 });
    }

    const passwordMatches = await bcrypt.compare(password, userFound.password);

    if (!passwordMatches) {
      return NextResponse.json(
        { message: "Incorrect password" },
        { status: 400 }
      );
    }

    const token = await createAccessToken({ id: userFound._id });

    const response = NextResponse.json(
      {
        id: userFound._id,
        username: userFound.username,
        email: userFound.email,
        profilePic: userFound.profilePic,
        createdAt: userFound.createdAt,
        updatedAt: userFound.updatedAt,
        token: token,
      },
      { status: 200 }
    );

    cookies().set({
      name: "token",
      value: token,
      httpOnly: process.env.NODE_ENV === "production" ? true : false, // For debugging, set to true in production
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // For cross-site requests
      maxAge: 60 * 60 * 24, // one day expiration time
      path: "/",
    });

    return response;
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
