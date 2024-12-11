
import { db } from "@/server/db"; // Your DB connection
import { users } from "@/server/db/schema"; // Your schema
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm"; // For the query condition

interface User {
  id: number;
  name: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: number }> }): Promise<NextResponse> {
  try {
    
    const id  =(await params).id
    const user: User[] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user[0], { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: number }> }): Promise<NextResponse> {
  try {
    const id  =(await params).id
    const body = await req.json() as { name: string };
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const updatedUser: User[] = await db
      .update(users)
      .set({ name })
      .where(eq(users.id, id))
      .returning();

    if (updatedUser.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser[0], { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: number }> }): Promise<NextResponse> {
  try {
    const id  =(await params).id
    const deletedEvento: User[] = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning();

    if (deletedEvento.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
