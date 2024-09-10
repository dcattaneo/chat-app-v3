import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";

export async function GET() {
    try {
        await connectDB()
        console.log('DB Connected')
        return NextResponse.json({ message: 'Database connected successfully' })

    } catch (error) {
        console.error('DB connection error:', error)
        return NextResponse.json({ message: 'Failed to connect to the database' }, { status: 500 });
    }
}