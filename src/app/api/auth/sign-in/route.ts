import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import { loginSchema } from "@/app/schema/authSchema";
import { validateSchema } from "@/app/middlewares/validateSchema";
import User from "@/app/models/user.model";
import bcrypt from 'bcrypt'
import { createAccessToken } from "@/app/lib/jwt";

export async function POST(request: NextRequest) {
    await connectDB()

    try {
        const data = await request.json()
        const validationResult = validateSchema(loginSchema)
        const result = await validationResult(data)

        if (result.status !== 200) {
            return result
        }

        const { email, password } = data

        const userFound = await User.findOne({ email })

        if (!userFound) {
            return NextResponse.json({ message: 'User not found' }, { status: 400 })
        }

        const passwordMatches = await bcrypt.compare(password, userFound.password);

        if (!passwordMatches) {
            return NextResponse.json({ message: 'Incorrect password' }, { status: 400 })
        }

        const token = await createAccessToken({ id: userFound._id }) as string

        const response = NextResponse.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            profilePic: userFound.profilePic,
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt
        })

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Only HTTPS in production
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Cross-site requests
        });

        return response



    } catch (error) {
        if (error instanceof Error) {
            NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 })
    }


}