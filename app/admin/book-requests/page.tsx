import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/database/drizzle";
import { borrowRecords, books, users } from "@/database/schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { FileText, CheckCircle, XCircle } from "lucide-react";
import ReturnBookButton from "@/components/admin/ReturnBookButton";

export default async function AdminBorrowRequestsPage() {
  const session = await auth();
  
  if (!session?.user?.id) redirect("/sign-in");

  // Fetch all borrow records with book and user details
  const borrowRequests = await db
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
        coverUrl: books.coverUrl,
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
    .orderBy(desc(borrowRecords.borrowDate));

  // Helper function to determine status badge color
  const getStatusBadge = (status: string, dueDate: Date | null, returnDate: Date | null) => {
    if (status === "RETURNED") {
      return {
        label: "Returned",
        className: "bg-green-100 text-green-700",
      };
    }
    
    if (status === "BORROWED" && dueDate) {
      const today = new Date();
      const due = new Date(dueDate);
      if (today > due) {
        return {
          label: "Late Return",
          className: "bg-red-100 text-red-700",
        };
      }
    }
    
    return {
      label: "Borrowed",
      className: "bg-blue-100 text-blue-700",
    };
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-dark-400">Borrow Book Requests</h1>
        <p className="text-sm text-slate-500">
          Manage and track all book borrowing requests
        </p>
      </div>

      {/* Borrow Requests Table */}
      <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Book
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  User Requested
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Borrowed Date
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Return Date
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Due Date
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {borrowRequests.map((request) => {
                const statusBadge = getStatusBadge(
                  request.status,
                  request.dueDate,
                  request.returnDate
                );
                
                return (
                  <tr key={request.id} className="hover:bg-slate-50 transition-colors">
                    {/* Book */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-8 flex-shrink-0 overflow-hidden rounded bg-slate-100">
                          {request.book?.coverUrl && (
                            <img
                              src={request.book.coverUrl}
                              alt={request.book.title}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-dark-400 line-clamp-1">
                            {request.book?.title || "Unknown Book"}
                          </p>
                          <p className="text-xs text-slate-500">
                            {request.book?.author || "Unknown Author"}
                          </p>
                        </div>
                      </div>
                    </td>
                    
                    {/* User Requested */}
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-dark-400">
                          {request.user?.fullName || "Unknown User"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {request.user?.email || ""}
                        </p>
                      </div>
                    </td>
                    
                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusBadge.className}`}>
                        {statusBadge.label}
                      </span>
                    </td>
                    
                    {/* Borrowed Date */}
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {request.borrowDate
                        ? new Date(request.borrowDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : "N/A"
                      }
                    </td>
                    
                    {/* Return Date */}
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {request.returnDate
                        ? new Date(request.returnDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : "-"
                      }
                    </td>
                    
                    {/* Due Date */}
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${
                        request.dueDate && new Date(request.dueDate) < new Date() && request.status !== "RETURNED"
                          ? "text-red-600"
                          : "text-slate-600"
                      }`}>
                        {request.dueDate
                          ? new Date(request.dueDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : "N/A"
                        }
                      </span>
                    </td>
                    
                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {request.status !== "RETURNED" && (
                          <ReturnBookButton
                            borrowId={request.id}
                            bookId={request.book?.id || ""}
                            bookTitle={request.book?.title || ""}
                          />
                        )}
                        <Link
                          href={`/admin/book-requests/${request.id}/receipt`}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
                        >
                          <FileText className="h-4 w-4" />
                          Receipt
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {borrowRequests.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-slate-500">No borrow requests found</p>
          </div>
        )}
      </div>
    </div>
  );
}