"use server";
import { NextResponse } from "next/server";
// import { cookies } from "next/headers";

export async function POST() {
  try {
    const response = NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );

    // 3 different methods to delete the token from cookies in  case of using "next/headers"
    // cookies().delete("token");
    // cookies().set("token", "");
    // cookies().set("token", "", { maxAge: 0 });

    // Method without using "next/headers"
    response.cookies.set("token", "", {
      expires: new Date(0),
      httpOnly: true,
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
