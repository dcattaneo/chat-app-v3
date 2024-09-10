import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from 'zod';

export function validateSchema(schema: z.ZodSchema) {
    return async (req: NextRequest) => {
        try {
            schema.parse(req)
            return NextResponse.next()
        } catch (error) {
            // Handling zod errors
            if (error instanceof ZodError) return NextResponse.json(error.issues.map((data) => {
                return data.message;
            }), { status: 400 })
            // Handling any other unknown errors
            return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 })
        }
    }
}
