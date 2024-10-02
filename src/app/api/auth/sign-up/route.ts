import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import { registerSchema } from "@/app/schema/authSchema";
import { validateSchema } from "@/app/middlewares/validateSchema";
import User from "@/app/models/user.model";
import bcrypt from "bcrypt";
import { createAccessToken } from "@/app/lib/jwt";

export async function POST(request: NextRequest) {
  await connectDB();

  try {
    const data = await request.json();

    const validationResult = validateSchema(registerSchema);
    const result = await validationResult(data);

    if (result.status !== 200) {
      return result;
    }

    const { username, email, password } = data;

    const userFound = await User.findOne({ email });
    if (userFound)
      return NextResponse.json(
        { message: "The email you want to use already exists" },
        { status: 400 }
      );

    const hashedPassword = await bcrypt.hash(password, 10);
    const randomPic = `https://avatar.iran.liara.run/username?username=${username}`;

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      profilePic: randomPic,
    });

    const savedUser = await newUser.save();

    const token = (await createAccessToken({ id: savedUser._id })) as string;

    const response = NextResponse.json(
      {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        profilePic: savedUser.profilePic,
        createdAt: savedUser.createdAt,
        updatedAt: savedUser.updatedAt,
        token: token,
      },
      { status: 200 }
    );

    // ---For development in case of bugs:

    // response.headers.set(
    //   "Access-Control-Allow-Origin",
    //   "http://localhost:3000"
    // );
    // response.headers.set("Access-Control-Allow-Credentials", "true");

    // ---in case of using "next/headers":

    // cookies().set("token", token, {
    // httpOnly: true,
    //secure: process.env.NODE_ENV === "production",
    //sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    // maxAge: 60 * 60 * 24,
    //path: "/",
    // });

    response.cookies.set("token", token, {
      httpOnly: true, // For debugging, set to true in production
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // For cross-site requests
      maxAge: 60 * 60 * 24, // expiration time: one day
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
