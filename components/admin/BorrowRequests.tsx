import { db } from "@/database/drizzle";
import { borrowRecords, books, users } from "@/database/schema";
import { eq, desc } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { Eye } from "lucide-react";

const BorrowRequests = async () => {
  // Fetch borrow requests with book and user details
  const borrowRequests = await db
    .select({
      id: borrowRecords.id,
      borrowDate: borrowRecords.borrowDate,
      dueDate: borrowRecords.dueDate,
      status: borrowRecords.status,
      book: {
        id: books.id,
        title: books.title,
        author: books.author,
        genre: books.genre,
        coverUrl: books.coverUrl,
        coverColor: books.coverColor,
      },
      user: {
        id: users.id,
        fullName: users.fullName,
        email: users.email,
      },
    })
    .from(borrowRecords)
    .leftJoin(books, eq(borrowRecords.bookId, books.id))
    .leftJoin(users, eq(borrowRecords.userId, users.id))
    .where(eq(borrowRecords.status, "BORROWED"))
    .orderBy(desc(borrowRecords.borrowDate))
    .limit(5);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-dark-400">Borrow Requests</h3>
        <Link
          href="/admin/book-requests"
          className="text-sm font-medium text-primary hover:underline"
        >
          View all
        </Link>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {borrowRequests.length === 0 ? (
          <p className="py-8 text-center text-slate-500">No active borrow requests</p>
        ) : (
          borrowRequests.map((request) => (
            <div
              key={request.id}
              className="flex items-center gap-4 rounded-lg border border-slate-100 p-4 transition-all hover:bg-slate-50"
            >
              {/* Book Cover */}
              <div className="h-16 w-12 flex-shrink-0 overflow-hidden rounded-md bg-slate-100">
                {request.book?.coverUrl ? (
                  <div
                    className="h-full w-full"
                    style={{ backgroundColor: request.book.coverColor || "#1e293b" }}
                  >
                    <img
                      src={request.book.coverUrl}
                      alt={request.book.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center bg-slate-200">
                    <span className="text-xs text-slate-400">No cover</span>
                  </div>
                )}
              </div>

              {/* Book Info */}
              <div className="flex-1">
                <h4 className="font-semibold text-dark-400">
                  {request.book?.title || "Unknown Book"}
                </h4>
                <p className="text-sm text-slate-500">
                  {request.book?.author || "Unknown Author"} · {request.book?.genre || "Unknown Genre"}
                </p>
                <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                  <span>👤 {request.user?.fullName || "Unknown User"}</span>
                  <span>•</span>
                  <span>📅 {new Date(request.borrowDate).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Action Button */}
              <Link
                href={`/admin/book-requests/${request.id}`}
                className="flex-shrink-0 rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-primary"
              >
                <Eye className="h-5 w-5" />
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BorrowRequests;