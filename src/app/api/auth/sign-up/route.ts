import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import { registerSchema } from "@/app/schema/authSchema";
import { validateSchema } from "@/app/middlewares/validateSchema";
import User from "@/app/models/user.model";
import bcrypt from 'bcrypt'
import { createAccessToken } from "@/app/lib/jwt";




export async function POST(request: NextRequest) {
    await connectDB()


    try {
        const data = await request.json()

        const validationResult = validateSchema(registerSchema)
        const result = await validationResult(data)

        if (result.status !== 200) {
            return result
        }

        const { username, email, password } = data

        const userFound = await User.findOne({ email })
        if (userFound) return NextResponse.json({ message: "The email you want to use already exists" }, { status: 400 })

        const hashedPassword = await bcrypt.hash(password, 10);
        const randomPic = `https://avatar.iran.liara.run/username?username=${username}`;

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            profilePic: randomPic
        })

        const savedUser = await newUser.save()

        const token = await createAccessToken({ id: savedUser._id }) as string;

        const response = NextResponse.json({
            id: savedUser._id,
            username: savedUser.username,
            email: savedUser.email,
            profilePic: savedUser.profilePic,
            createdAt: savedUser.createdAt,
            updatedAt: savedUser.updatedAt
        })

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Only HTTPS in production
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Cross-site requests
        });

        return response



    } catch (error) {
        return NextResponse.json({ error: 'Failed to register user' }, { status: 500 })
    }



}