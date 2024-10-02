import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";

export async function GET() {
  try {
    const connection = await connectDB();
    if (connection) {
      console.log("DB Connected");
      return NextResponse.json(
        { message: "Database connected successfully" },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { message: "failed to connect to the Database" },
      { status: 500 }
    );
  } catch (error) {
    console.error("DB connection error:", error);
    return NextResponse.json(
      { message: "Failed to connect to the database" },
      { status: 500 }
    );
  }
}

