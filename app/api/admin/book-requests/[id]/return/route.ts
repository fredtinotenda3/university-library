import { db } from "@/database/drizzle";
import { borrowRecords, books } from "@/database/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;
    const { bookId } = await request.json();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Update borrow record status to RETURNED and set return date
    await db
      .update(borrowRecords)
      .set({ 
        status: "RETURNED",
        returnDate: new Date(),
      })
      .where(eq(borrowRecords.id, id));

    // Increase available copies count
    const [book] = await db
      .select({ availableCopies: books.availableCopies })
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1);

    if (book) {
      await db
        .update(books)
        .set({ availableCopies: book.availableCopies + 1 })
        .where(eq(books.id, bookId));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error returning book:", error);
    return NextResponse.json({ error: "Failed to return book" }, { status: 500 });
  }
}