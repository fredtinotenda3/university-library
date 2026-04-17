import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/database/drizzle";
import { borrowRecords, books, users } from "@/database/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { ArrowLeft, Calendar, User, BookOpen, Clock, CheckCircle, XCircle } from "lucide-react";

export default async function BorrowRequestDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;
  
  if (!session?.user?.id) redirect("/sign-in");

  // Fetch borrow record with book and user details
  const [borrowRecord] = await db
    .select({
      id: borrowRecords.id,
      borrowDate: borrowRecords.borrowDate,
      dueDate: borrowRecords.dueDate,
      returnDate: borrowRecords.returnDate,
      status: borrowRecords.status,
      createdAt: borrowRecords.createdAt,
      book: {
        id: books.id,
        title: books.title,
        author: books.author,
        genre: books.genre,
        coverUrl: books.coverUrl,
        coverColor: books.coverColor,
        description: books.description,
        totalCopies: books.totalCopies,
        availableCopies: books.availableCopies,
      },
      user: {
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        universityId: users.universityId,
        universityCard: users.universityCard,
        status: users.status,
      },
    })
    .from(borrowRecords)
    .leftJoin(books, eq(borrowRecords.bookId, books.id))
    .leftJoin(users, eq(borrowRecords.userId, users.id))
    .where(eq(borrowRecords.id, id))
    .limit(1);

  if (!borrowRecord) {
    redirect("/admin/book-requests");
  }

  // Helper function to get status badge
  const getStatusBadge = () => {
    if (borrowRecord.status === "RETURNED") {
      return {
        label: "Returned",
        className: "bg-green-100 text-green-700",
        icon: CheckCircle,
      };
    }
    
    if (borrowRecord.dueDate && new Date(borrowRecord.dueDate) < new Date()) {
      return {
        label: "Late Return",
        className: "bg-red-100 text-red-700",
        icon: XCircle,
      };
    }
    
    return {
      label: "Borrowed",
      className: "bg-blue-100 text-blue-700",
      icon: BookOpen,
    };
  };

  const statusBadge = getStatusBadge();
  const StatusIcon = statusBadge.icon;

  return (
    <div className="flex flex-col gap-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/book-requests"
          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-dark-400">Borrow Request Details</h1>
          <p className="text-sm text-slate-500">View complete borrow request information</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Book Info */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-dark-400">Book Information</h2>
            
            <div className="flex gap-6">
              {/* Book Cover */}
              <div className="h-48 w-32 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                {borrowRecord.book?.coverUrl ? (
                  <div
                    className="h-full w-full"
                    style={{ backgroundColor: borrowRecord.book.coverColor || "#1e293b" }}
                  >
                    <img
                      src={borrowRecord.book.coverUrl}
                      alt={borrowRecord.book.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center bg-slate-200">
                    <BookOpen className="h-8 w-8 text-slate-400" />
                  </div>
                )}
              </div>

              {/* Book Details */}
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-xl font-semibold text-dark-400">
                    {borrowRecord.book?.title || "Unknown Book"}
                  </h3>
                  <p className="text-slate-500">by {borrowRecord.book?.author || "Unknown Author"}</p>
                </div>
                
                <div>
                  <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">
                    {borrowRecord.book?.genre || "Unknown Genre"}
                  </span>
                </div>
                
                <div className="flex gap-4 text-sm">
                  <div>
                    <p className="text-slate-500">Total Copies</p>
                    <p className="font-semibold text-dark-400">{borrowRecord.book?.totalCopies || 0}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Available Copies</p>
                    <p className="font-semibold text-green-600">{borrowRecord.book?.availableCopies || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Book Description */}
            {borrowRecord.book?.description && (
              <div className="mt-6">
                <h4 className="mb-2 font-semibold text-dark-400">Description</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {borrowRecord.book.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Borrow Details */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-dark-400">Borrow Details</h2>
            
            <div className="space-y-4">
              {/* Status */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <StatusIcon className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-500">Status</span>
                </div>
                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusBadge.className}`}>
                  {statusBadge.label}
                </span>
              </div>

              {/* Borrow ID */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-500">Request ID</span>
                </div>
                <span className="text-sm font-medium text-dark-400">
                  {borrowRecord.id.slice(0, 8)}...
                </span>
              </div>

              {/* Borrow Date */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-500">Borrowed Date</span>
                </div>
                <span className="text-sm font-medium text-dark-400">
                  {borrowRecord.borrowDate
                    ? new Date(borrowRecord.borrowDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : "N/A"}
                </span>
              </div>

              {/* Due Date */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-500">Due Date</span>
                </div>
                <span className={`text-sm font-medium ${
                  borrowRecord.dueDate && new Date(borrowRecord.dueDate) < new Date() && borrowRecord.status !== "RETURNED"
                    ? "text-red-600"
                    : "text-dark-400"
                }`}>
                  {borrowRecord.dueDate
                    ? new Date(borrowRecord.dueDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : "N/A"}
                </span>
              </div>

              {/* Return Date */}
              {borrowRecord.returnDate && (
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-500">Returned Date</span>
                  </div>
                  <span className="text-sm font-medium text-green-600">
                    {new Date(borrowRecord.returnDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* User Information Card */}
          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-dark-400">Borrower Information</h2>
            
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-500">Full Name</p>
                <p className="font-medium text-dark-400">{borrowRecord.user?.fullName || "Unknown User"}</p>
              </div>
              
              <div>
                <p className="text-xs text-slate-500">Email</p>
                <p className="text-sm text-slate-600">{borrowRecord.user?.email || "N/A"}</p>
              </div>
              
              <div>
                <p className="text-xs text-slate-500">University ID</p>
                <p className="text-sm text-slate-600">{borrowRecord.user?.universityId || "N/A"}</p>
              </div>
              
              <div>
                <p className="text-xs text-slate-500">Account Status</p>
                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                  borrowRecord.user?.status === "APPROVED"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}>
                  {borrowRecord.user?.status || "PENDING"}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-3">
            <Link
              href={`/admin/book-requests/${borrowRecord.id}/receipt`}
              className="flex-1 rounded-lg bg-primary px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-primary/90"
            >
              View Receipt
            </Link>
            <Link
              href="/admin/book-requests"
              className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-center text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
            >
              Back to List
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}