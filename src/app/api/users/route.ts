
import { users } from "@/server/db/schema"; 
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db/index"; 


interface User {
  id: number;
  name: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
}

export async function GET(): Promise<NextResponse> {
  try {
    const user: User[] = await db.select().from(users);
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json() as { name: string };
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const [newUser] = await db
      .insert(users)
      .values({ name })
      .returning();

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
