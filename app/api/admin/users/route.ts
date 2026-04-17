import { db } from "@/database/drizzle";
import { users, borrowRecords } from "@/database/schema";
import { desc, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const allUsers = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        universityId: users.universityId,
        universityCard: users.universityCard,
        status: users.status,
        role: users.role,
        createdAt: users.createdAt,
        borrowedCount: sql<number>`(
          SELECT COUNT(*) FROM ${borrowRecords}
          WHERE ${borrowRecords.userId} = ${users.id}
          AND ${borrowRecords.status} = 'BORROWED'
        )`,
      })
      .from(users)
      .orderBy(desc(users.createdAt));

    return NextResponse.json({ users: allUsers });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}