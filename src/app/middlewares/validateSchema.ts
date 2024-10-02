import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";

export function validateSchema(schema: z.ZodSchema) {
  return async (req: NextRequest) => {
    try {
      schema.parse(req);
      return NextResponse.next();
    } catch (error) {
      // Handling zod errors
      if (error instanceof ZodError) {
        const errors = error.issues.map((data) => {
          return data.message;
        });
        return NextResponse.json({ message: errors }, { status: 400 });
      }

      // Handling any other unknown errors
      return NextResponse.json(
        { error: "An unexpected error occurred" },
        { status: 500 }
      );
    }
  };
}
