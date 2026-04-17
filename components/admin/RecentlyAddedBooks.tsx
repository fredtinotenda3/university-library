import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { Plus } from "lucide-react";

const RecentlyAddedBooks = async () => {
  // Fetch recently added books
  const recentBooks = await db
    .select({
      id: books.id,
      title: books.title,
      author: books.author,
      genre: books.genre,
      coverUrl: books.coverUrl,
      coverColor: books.coverColor,
      createdAt: books.createdAt,
    })
    .from(books)
    .orderBy(desc(books.createdAt))
    .limit(5);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-dark-400">Recently Added Books</h3>
        <Link
          href="/admin/books"
          className="text-sm font-medium text-primary hover:underline"
        >
          View all
        </Link>
      </div>

      {/* Add New Book Button */}
      <Link
        href="/admin/books/new"
        className="mb-4 flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 p-4 transition-all hover:border-primary hover:bg-primary/5"
      >
        <Plus className="h-5 w-5 text-primary" />
        <span className="font-medium text-primary">Add New Book</span>
      </Link>

      {/* Books List */}
      <div className="space-y-3">
        {recentBooks.length === 0 ? (
          <p className="py-8 text-center text-slate-500">No books added yet</p>
        ) : (
          recentBooks.map((book) => (
            <Link
              key={book.id}
              href={`/admin/books/${book.id}`}
              className="flex gap-3 rounded-lg p-3 transition-all hover:bg-slate-50"
            >
              {/* Book Cover */}
              <div className="h-14 w-10 flex-shrink-0 overflow-hidden rounded-md bg-slate-100">
                {book.coverUrl ? (
                  <div
                    className="h-full w-full"
                    style={{ backgroundColor: book.coverColor || "#1e293b" }}
                  >
                    <img
                      src={book.coverUrl}
                      alt={book.title}
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
                <h4 className="text-sm font-semibold text-dark-400 line-clamp-1">
                  {book.title}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-1">
                  {book.author} · {book.genre}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Added {book.createdAt ? new Date(book.createdAt).toLocaleDateString() : "Recently"}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentlyAddedBooks;