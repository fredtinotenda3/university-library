"use server";

import { books } from "@/database/schema";
import { db } from "@/database/drizzle";
import { eq } from "drizzle-orm";

export const createBook = async (params: BookParams) => {
  try {
    const newBook = await db
      .insert(books)
      .values({
        ...params,
        availableCopies: params.totalCopies,
      })
      .returning();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newBook[0])),
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "An error occurred while creating the book",
    };
  }
};

export const updateBook = async (id: string, params: Partial<BookParams>) => {
  try {
    const updatedBook = await db
      .update(books)
      .set({
        ...params,
        availableCopies: params.totalCopies,
      })
      .where(eq(books.id, id))
      .returning();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(updatedBook[0])),
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "An error occurred while updating the book",
    };
  }
};

export const deleteBook = async (id: string) => {
  try {
    await db.delete(books).where(eq(books.id, id));
    return {
      success: true,
      message: "Book deleted successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "An error occurred while deleting the book",
    };
  }
};