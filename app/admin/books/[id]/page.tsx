import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { ArrowLeft, Edit, BookOpen, Users, Calendar } from "lucide-react";

export default async function BookDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;
  
  if (!session?.user?.id) redirect("/sign-in");

  const [book] = await db
    .select()
    .from(books)
    .where(eq(books.id, id))
    .limit(1);

  if (!book) redirect("/admin/books");

  return (
    <div className="flex flex-col gap-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/books"
          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-dark-400">{book.title}</h1>
          <p className="text-sm text-slate-500">Book Details</p>
        </div>
        <Link
          href={`/admin/books/${book.id}/edit`}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
        >
          <Edit className="h-4 w-4" />
          Edit Book
        </Link>
      </div>

      {/* Book Details Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Book Cover */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="aspect-[2/3] w-full overflow-hidden rounded-lg bg-slate-100">
              {book.coverUrl ? (
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <BookOpen className="h-12 w-12 text-slate-400" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Book Info */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-dark-400">
              Book Information
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">Title</p>
                  <p className="text-dark-400">{book.title}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Author</p>
                  <p className="text-dark-400">{book.author}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">Genre</p>
                  <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">
                    {book.genre}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Rating</p>
                  <div className="flex items-center gap-1">
                    <span className="text-dark-400">{book.rating}</span>
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm text-slate-500">/ 5</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Copies</p>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-slate-400" />
                    <span className="text-dark-400">{book.totalCopies}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Available Copies</p>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-slate-400" />
                    <span className="text-green-600 font-semibold">{book.availableCopies}</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500">Created At</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span className="text-dark-400">
                    {book.createdAt
                      ? new Date(book.createdAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : "N/A"}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500">Description</p>
                <p className="mt-1 text-dark-400 leading-relaxed">
                  {book.description}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500">Summary</p>
                <p className="mt-1 text-dark-400 leading-relaxed">
                  {book.summary}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}