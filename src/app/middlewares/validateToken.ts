import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

interface DecodedToken extends JwtPayload {
  id: string;
}

export async function validateToken(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "No token, authorization denied" },
        { status: 401 }
      );
    }

    // verify the token
    const verifiedToken = jwt.verify(
      token,
      process.env.PRIVATE_KEY || "secret", //ver typescript error
      (err, decoded) => {
        if (err) {
          return NextResponse.json(
            { message: "Invalid token" },
            { status: 403 }
          );
        }

        // destructuring the jwt id, which is the same id as the MongoDB user._id
        const { id } = decoded as DecodedToken;
        // creating the constant userId in order to make it clear that the Id corresponds to the loggedInUser
        const userId = id;
        return userId;
      }
    );

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
