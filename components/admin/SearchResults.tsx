import { db } from "@/database/drizzle";
import { books, users } from "@/database/schema";
import { ilike, or } from "drizzle-orm";
import Link from "next/link";
import { getInitials } from "@/lib/utils";

interface SearchResultsProps {
  query: string;
  searchType: "all" | "users" | "books";
}

const SearchResults = async ({ query, searchType }: SearchResultsProps) => {
  if (!query) return null;

  let bookResults: any[] = [];
  let userResults: any[] = [];

  // Search books
  if (searchType === "all" || searchType === "books") {
    bookResults = await db
      .select({
        id: books.id,
        title: books.title,
        author: books.author,
        genre: books.genre,
        coverUrl: books.coverUrl,
        coverColor: books.coverColor,
      })
      .from(books)
      .where(
        or(
          ilike(books.title, `%${query}%`),
          ilike(books.author, `%${query}%`),
          ilike(books.genre, `%${query}%`)
        )
      )
      .limit(5);
  }

  // Search users
  if (searchType === "all" || searchType === "users") {
    userResults = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        status: users.status,
      })
      .from(users)
      .where(
        or(
          ilike(users.fullName, `%${query}%`),
          ilike(users.email, `%${query}%`)
        )
      )
      .limit(5);
  }

  const totalResults = bookResults.length + userResults.length;

  if (totalResults === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="text-slate-500">No results found for "{query}"</p>
        <p className="mt-2 text-sm text-slate-400">
          Try searching by title, author, genre, name, or email
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Book Results */}
      {bookResults.length > 0 && (
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-dark-400">
            Books ({bookResults.length})
          </h3>
          <div className="space-y-3">
            {bookResults.map((book) => (
              <Link
                key={book.id}
                href={`/admin/books/${book.id}`}
                className="flex gap-3 rounded-lg p-3 transition-all hover:bg-slate-50"
              >
                <div className="h-14 w-10 flex-shrink-0 overflow-hidden rounded-md bg-slate-100">
                  <div
                    className="h-full w-full"
                    style={{ backgroundColor: book.coverColor || "#1e293b" }}
                  >
                    {book.coverUrl && (
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-dark-400">{book.title}</h4>
                  <p className="text-sm text-slate-500">
                    {book.author} · {book.genre}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* User Results */}
      {userResults.length > 0 && (
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-dark-400">
            Users ({userResults.length})
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {userResults.map((user) => (
              <Link
                key={user.id}
                href={`/admin/users/${user.id}`}
                className="flex items-center gap-3 rounded-lg p-3 transition-all hover:bg-slate-50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <span className="text-sm font-semibold">
                    {getInitials(user.fullName)}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-dark-400">{user.fullName}</h4>
                  <p className="text-xs text-slate-500">{user.email}</p>
                  <p className="text-xs">
                    <span
                      className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs ${
                        user.status === "APPROVED"
                          ? "bg-green-100 text-green-600"
                          : user.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {user.status}
                    </span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;