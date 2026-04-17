import { db } from "@/database/drizzle";
import { borrowRecords, books, users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [borrowRecord] = await db
      .select({
        id: borrowRecords.id,
        borrowDate: borrowRecords.borrowDate,
        dueDate: borrowRecords.dueDate,
        returnDate: borrowRecords.returnDate,
        status: borrowRecords.status,
        book: {
          id: books.id,
          title: books.title,
          author: books.author,
          genre: books.genre,
          coverUrl: books.coverUrl,
          coverColor: books.coverColor,
          description: books.description,
        },
        user: {
          id: users.id,
          fullName: users.fullName,
          email: users.email,
          universityId: users.universityId,
        },
      })
      .from(borrowRecords)
      .leftJoin(books, eq(borrowRecords.bookId, books.id))
      .leftJoin(users, eq(borrowRecords.userId, users.id))
      .where(eq(borrowRecords.id, id))
      .limit(1);

    if (!borrowRecord) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(borrowRecord);
  } catch (error) {
    console.error("Error fetching borrow record:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}