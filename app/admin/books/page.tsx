import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { Eye, PenSquare, Plus, ArrowUpDown } from "lucide-react";
import DeleteBookButton from "@/components/admin/DeleteBookButton";

export default async function AdminBooksPage() {
  const session = await auth();
  
  if (!session?.user?.id) redirect("/sign-in");

  // Fetch all books from database
  const allBooks = await db
    .select({
      id: books.id,
      title: books.title,
      author: books.author,
      genre: books.genre,
      rating: books.rating,
      totalCopies: books.totalCopies,
      availableCopies: books.availableCopies,
      coverUrl: books.coverUrl,
      coverColor: books.coverColor,
      createdAt: books.createdAt,
    })
    .from(books)
    .orderBy(desc(books.createdAt));

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-dark-400">All Books</h1>
          <p className="text-sm text-slate-500">
            Manage your library collection
          </p>
        </div>
        
        {/* Create New Book Button */}
        <Link
          href="/admin/books/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Create a New Book
        </Link>
      </div>

      {/* Sort Options */}
      <div className="flex items-center justify-end">
        <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50">
          <ArrowUpDown className="h-4 w-4" />
          A-Z
        </button>
      </div>

      {/* Books Table */}
      <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Book Title
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Author
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Genre
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Date Created
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allBooks.map((book) => (
                <tr key={book.id} className="hover:bg-slate-50 transition-colors">
                  {/* Book Title */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-8 flex-shrink-0 overflow-hidden rounded bg-slate-100">
                        {book.coverUrl && (
                          <img
                            src={book.coverUrl}
                            alt={book.title}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <span className="font-medium text-dark-400">
                        {book.title}
                      </span>
                    </div>
                   </td>
                  
                  {/* Author */}
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {book.author}
                   </td>
                  
                  {/* Genre */}
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">
                      {book.genre}
                    </span>
                   </td>
                  
                  {/* Date Created */}
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {book.createdAt 
                      ? new Date(book.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })
                      : "N/A"
                    }
                   </td>
                  
                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/books/${book.id}`}
                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-primary"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/admin/books/${book.id}/edit`}
                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-blue-600"
                      >
                        <PenSquare className="h-4 w-4" />
                      </Link>
                      <DeleteBookButton bookId={book.id} bookTitle={book.title} />
                    </div>
                   </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {allBooks.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-slate-500">No books found</p>
            <Link
              href="/admin/books/new"
              className="mt-4 inline-flex items-center gap-2 text-primary hover:underline"
            >
              <Plus className="h-4 w-4" />
              Create your first book
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}