"use server";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
// import { cookies } from "next/headers";

interface DecodedToken extends JwtPayload {
  id: string;
}

export async function validateToken(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    //obtaining the cookies from next/headers
    // const token = cookies().get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "No token, authorization denied" },
        { status: 401 }
      );
    }

    // verify the token
    const secretKey = process.env.PRIVATE_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { message: "Authentication error" },
        { status: 401 }
      );
    }
    const verifiedToken = jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return NextResponse.json({ message: "Invalid token or authorization error" }, { status: 403 });
      }

      // destructuring the jwt id, which is the same id as the MongoDB user._id
      const { id } = decoded as DecodedToken;
      // creating the constant userId in order to make it clear that the Id corresponds to the loggedInUser
      const userId = id;
      return userId;
    });

    return verifiedToken;
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error }, { status: 500 });
    }
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
