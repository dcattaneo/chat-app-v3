import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import { validateToken } from "@/app/middlewares/validateToken";
import Conversation from "@/app/models/conversation.model";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();

  try {
    const tokenData = await validateToken(request);
    if (tokenData instanceof NextResponse) {
      return tokenData; // This means token validation failed
    }

    // The middleware returns the loggedInUserId(senderId)
    const senderId = tokenData;

    // The id extracted from params belongs to the userToChat
    const { id: userToChatId } = params;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages"); // This method is used for getting each message from the array of messages

    if (!conversation) {
      return NextResponse.json([], { status: 200 });
    }

    const messages = conversation.messages;

    return NextResponse.json(
      {
        messages,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in get-messages controller:", error.message);
      return NextResponse.json(
        { message: "Failed to get messages" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
