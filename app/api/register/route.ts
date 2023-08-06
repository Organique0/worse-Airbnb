import bcrypt from "bcrypt";
import prisma from '@/app/libs/prismadb';
import { NextResponse } from "next/server";

export async function POST(request:Request, res:Response) {
    const body = await request.json();
    const {
        email,
        name,
        password
    } = body;

    const hashedPassword = await bcrypt.hash(password,12);

    const existing = await prisma.user.findUnique({ where: { email: email } });
   if (existing) {
    // Return an error response with status code 409 (Conflict)
    return NextResponse.json({ error: 'User already exists or is linked with Google.' }, { status: 500 });
  }

    const user = await prisma.user.create({
        data: {
            email,
            name,
            hashedPassword
        }
    });

    return NextResponse.json(user);
}