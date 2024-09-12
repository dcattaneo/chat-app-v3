import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import { validateToken } from "@/app/middlewares/validateToken";
import Conversation from "@/app/models/conversation.model";
import Message from "@/app/models/message.model";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();

  try {
    const tokenData = await validateToken(request);
    if (tokenData instanceof NextResponse) {
      return tokenData; // This means token validation failed
    }

    const { message } = await request.json();

    // The id extracted from req.params belongs to the receiverId
    const { id: receiverId } = params;
    // The id extracted from the middleware  belongs to the senderId
    const senderId = tokenData;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    // This promise runs in parallel
    await Promise.all([conversation.save(), newMessage.save()]);

    return NextResponse.json(newMessage, {
      status: 201,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in create-messages controller:", error.message);
      return NextResponse.json(
        { message: "Failed to create message" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
