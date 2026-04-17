import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BookForm from "@/components/admin/forms/BookForm";

export default async function EditBookPage({
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
          href={`/admin/books/${book.id}`}
          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-dark-400">Edit Book</h1>
          <p className="text-sm text-slate-500">Update book information</p>
        </div>
      </div>

      {/* Book Form */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <BookForm 
          type="update" 
          id={book.id}
          title={book.title}
          description={book.description}
          author={book.author}
          genre={book.genre}
          rating={book.rating}
          totalCopies={book.totalCopies}
          coverUrl={book.coverUrl}
          coverColor={book.coverColor}
          videoUrl={book.videoUrl}
          summary={book.summary}
        />
      </div>
    </div>
  );
}