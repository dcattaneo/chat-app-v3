import { NextResponse } from "next/server";




export async function POST() {


    try {
        const response = NextResponse.json({ message: 'Logged out successfully' }, { status: 200 })
        response.cookies.set("token", "", { expires: new Date(0), httpOnly: true, sameSite: 'lax' })

        return response

    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 })
    }


}


